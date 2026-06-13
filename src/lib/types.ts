// CalmOS TypeScript types

export interface User {
  nickname: string;
  emoji: string;
  deviceToken: string;
}

export interface Answers {
  [key: string]: string;
}

export interface SessionRecord {
  id: number;
  date: string;
  keyword: string;
  primary_cause: string;
  anxiety_before: number;
  anxiety_after: number;
  module_used: string;
  helpfulness: string;
}

export interface ModuleDetail {
  type: string;
  [key: string]: unknown;
}

export interface RecommendedModule {
  type: string;
  title: string;
  reason: string;
  estimated_minutes: number;
}

export interface AIResult {
  primary_cause: string;
  summary: string;
  evidence: string[];
  recommended_modules: RecommendedModule[];
  module_details: ModuleDetail[];
  closing_message: string;
}

export interface PendingModule {
  type: string;
  detail: ModuleDetail;
}

export type Screen =
  | 'onboarding'
  | 'home'
  | 'questionnaire'
  | 'analysis'
  | 'error'
  | 'results'
  | 'intervention'
  | 'feedback';

export interface AppState {
  screen: Screen;
  user: User | null;
  answers: Answers;
  currentQ: number;
  anxietyBefore: number;
  aiResult: AIResult | null;
  activeModule: PendingModule | null;
  pendingModules: PendingModule[];
  currentModuleIdx: number;
  totalModules: number;
  supabaseReady: boolean;
  errorDetail: string;
}

export type AppAction =
  | { type: 'NAVIGATE'; screen: Screen; patch?: Partial<AppState> }
  | { type: 'SET_SUPABASE_READY'; ready: boolean }
  | { type: 'SET_USER'; user: User };
