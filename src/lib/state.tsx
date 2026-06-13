'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AppState, AppAction, PendingModule, AIResult, SessionRecord, User } from './types';
import { getGreeting, getQuestionSequence, buildUserMessage } from './constants';
import { loadUser, saveUser, loadSessions, saveSessionLocal, getDeviceToken } from './storage';
import { loadSessionsCloud, saveSessionCloud } from './supabase';

const initialState: AppState = {
  screen: 'onboarding',
  user: null,
  answers: {},
  currentQ: 1,
  anxietyBefore: 7,
  aiResult: null,
  activeModule: null,
  pendingModules: [],
  currentModuleIdx: 0,
  totalModules: 2,
  supabaseReady: false,
  errorDetail: '',
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen, ...action.patch };
    case 'SET_SUPABASE_READY':
      return { ...state, supabaseReady: action.ready };
    case 'SET_USER':
      return { ...state, user: action.user, screen: 'home' };
    default:
      return state;
  }
}

// API endpoint — always use the local Next.js API route.
// Key and prompt are server-side only, never exposed to the browser.

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (screen: AppState['screen'], patch?: Partial<AppState>) => void;
  initApp: () => void;
  handleStartAnalysis: () => void;
  handleQuestionAnswer: (qId: string, value: string) => void;
  handleBackFromQuestionnaire: () => void;
  handleModuleSelect: (idx: number) => void;
  handleModuleComplete: () => void;
  handleSaveFeedback: (afterScore: number, helpfulness: string) => void;
  loadAllSessions: () => Promise<SessionRecord[]>;
  handleOnboarding: (nickname: string, emoji: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useCallback(
    (screen: AppState['screen'], patch?: Partial<AppState>) => {
      dispatch({ type: 'NAVIGATE', screen, patch });
    },
    []
  );

  const initApp = useCallback(() => {
    const user = loadUser();
    if (user) {
      // Backfill deviceToken for old users
      if (!user.deviceToken) {
        user.deviceToken = getDeviceToken();
        saveUser(user.nickname, user.emoji);
      }
      dispatch({ type: 'SET_USER', user });
    }
  }, []);

  const handleOnboarding = useCallback(
    (nickname: string, emoji: string) => {
      saveUser(nickname, emoji);
      const deviceToken = getDeviceToken();
      const user: User = { nickname, emoji, deviceToken };
      dispatch({ type: 'SET_USER', user });
    },
    []
  );

  const loadAllSessions = useCallback(async (): Promise<SessionRecord[]> => {
    const uid = getDeviceToken();
    const cloud = await loadSessionsCloud(uid);
    return cloud;
  }, []);

  const handleStartAnalysis = useCallback(() => {
    navigate('questionnaire', { answers: {}, currentQ: 1, anxietyBefore: 7 });
  }, [navigate]);

  const handleQuestionAnswer = useCallback(
    (qId: string, value: string) => {
      const newAnswers = { ...state.answers, [qId]: value };
      const seq = getQuestionSequence(newAnswers);
      const curIdx = seq.indexOf(qId);
      if (curIdx + 1 < seq.length) {
        const nextQ = parseInt(seq[curIdx + 1].replace('Q', ''));
        navigate('questionnaire', { answers: newAnswers, currentQ: nextQ });
      } else {
        // Start analysis
        const userMsg = buildUserMessage(newAnswers);
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userMessage: userMsg }),
        })
          .then((r) => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
          })
          .then((result: AIResult) => {
            const pending: PendingModule[] = (result.module_details || []).map(
              (d, i) => ({
                type: result.recommended_modules[i]?.type || d.type,
                detail: d,
              })
            );
            navigate('results', {
              answers: newAnswers,
              aiResult: result,
              pendingModules: pending,
              totalModules: pending.length || 2,
            });
          })
          .catch((err) => {
            dispatch({
              type: 'NAVIGATE',
              screen: 'error',
              patch: { errorDetail: err.message || '未知错误' },
            });
          });
        navigate('analysis', { answers: newAnswers });
      }
    },
    [state.answers, navigate]
  );

  const handleBackFromQuestionnaire = useCallback(() => {
    const seq = getQuestionSequence(state.answers);
    const qId = 'Q' + state.currentQ;
    const idx = seq.indexOf(qId);
    if (idx <= 0) {
      navigate('home');
    } else {
      const prevQ = parseInt(seq[idx - 1].replace('Q', ''));
      navigate('questionnaire', { currentQ: prevQ });
    }
  }, [state.answers, state.currentQ, navigate]);

  const handleModuleSelect = useCallback(
    (idx: number) => {
      const m = state.pendingModules[idx];
      const otherIdx = idx === 0 ? 1 : 0;
      const remaining = [state.pendingModules[otherIdx]].filter(Boolean);
      navigate('intervention', {
        activeModule: m,
        pendingModules: remaining,
        currentModuleIdx: state.totalModules - remaining.length,
      });
    },
    [state.pendingModules, state.totalModules, navigate]
  );

  const handleModuleComplete = useCallback(() => {
    if (state.pendingModules.length > 0) {
      const next = state.pendingModules[0];
      const remaining = state.pendingModules.slice(1);
      navigate('intervention', {
        activeModule: next,
        pendingModules: remaining,
        currentModuleIdx: state.totalModules - remaining.length,
      });
    } else {
      navigate('feedback');
    }
  }, [state.pendingModules, state.totalModules, navigate]);

  const handleSaveFeedback = useCallback(
    (afterScore: number, helpfulness: string) => {
      const record: SessionRecord = {
        id: Date.now(),
        date: new Date().toLocaleDateString('zh-CN'),
        keyword: state.answers.Q2 || state.answers.Q1 || '',
        primary_cause: state.aiResult?.primary_cause || '',
        anxiety_before: state.anxietyBefore,
        anxiety_after: afterScore,
        module_used: state.activeModule?.type || '',
        helpfulness,
      };

      // Save local first (sync, instant)
      saveSessionLocal(record);

      // Save to Supabase (async, non-blocking)
      const uid = getDeviceToken();
      saveSessionCloud(
        record,
        uid,
        state.user?.nickname || '',
        state.answers,
        state.aiResult
      );

      navigate('home');
    },
    [state, navigate]
  );

  const value: AppContextType = {
    state,
    dispatch,
    navigate,
    initApp,
    handleStartAnalysis,
    handleQuestionAnswer,
    handleBackFromQuestionnaire,
    handleModuleSelect,
    handleModuleComplete,
    handleSaveFeedback,
    loadAllSessions,
    handleOnboarding,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
