'use client';

import { useEffect } from 'react';
import { AppProvider, useApp } from '@/lib/state';
import { Onboarding } from '@/components/Onboarding';
import { HomeScreen } from '@/components/Home';
import { Questionnaire } from '@/components/Questionnaire';
import { Analysis } from '@/components/Analysis';
import { Results } from '@/components/Results';
import { ErrorScreen } from '@/components/ErrorScreen';
import { InterventionRouter } from '@/components/InterventionRouter';
import { Feedback } from '@/components/Feedback';

function ScreenRouter() {
  const { state, initApp } = useApp();

  useEffect(() => {
    initApp();
  }, [initApp]);

  switch (state.screen) {
    case 'onboarding':
      return <Onboarding />;
    case 'home':
      return <HomeScreen />;
    case 'questionnaire':
      return <Questionnaire />;
    case 'analysis':
      return <Analysis />;
    case 'error':
      return <ErrorScreen />;
    case 'results':
      return <Results />;
    case 'intervention':
      return <InterventionRouter />;
    case 'feedback':
      return <Feedback />;
    default:
      return <Onboarding />;
  }
}

export default function Home() {
  return (
    <AppProvider>
      <div id="app">
        <ScreenRouter />
      </div>
    </AppProvider>
  );
}
