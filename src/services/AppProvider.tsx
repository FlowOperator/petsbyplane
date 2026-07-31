import React, { useReducer, useEffect } from 'react';
import { AppContext, appReducer, initialState } from './store';
import {
  mockOwner,
  mockPet,
  mockTrip,
  mockConsultant,
  mockDocuments,
} from './mockData';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the app with global state.
 * Seeds mock data in development — will be replaced by API calls.
 */
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Seed mock data on mount (simulates loading from backend)
  useEffect(() => {
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    dispatch({ type: 'SET_OWNER', payload: mockOwner });
    dispatch({ type: 'ADD_PET', payload: mockPet });
    dispatch({ type: 'SET_TRIPS', payload: [mockTrip] });
    dispatch({ type: 'SET_ACTIVE_TRIP', payload: mockTrip });
    dispatch({ type: 'SET_CONSULTANT', payload: mockConsultant });
    dispatch({ type: 'SET_DOCUMENTS', payload: mockDocuments });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
