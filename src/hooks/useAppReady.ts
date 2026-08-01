import { useState, useEffect } from 'react';
import { useAppState } from '../services/store';

/**
 * Returns true once the app has loaded initial data.
 * Use to show skeleton states while data is being hydrated.
 */
export function useAppReady(): boolean {
  const { state } = useAppState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The AppProvider seeds data in a useEffect, so on the first render
    // after mount, data will be available. We check for owner being set
    // as the signal that hydration is complete.
    if (state.owner || state.isAuthenticated) {
      setReady(true);
    }
  }, [state.owner, state.isAuthenticated]);

  return ready;
}
