import React, { useReducer } from 'react';
import { AppContext, appReducer, initialState } from './store';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the app with global state.
 * V1: starts empty — no mock data seeded.
 * The app begins in the no-booking state.
 * Data is populated through the real user flow (quote → checkout → booking).
 */
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
