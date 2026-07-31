import React, { useReducer } from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../src/theme';
import {
  QuoteFlowContext,
  quoteFlowReducer,
  initialQuoteState,
} from '../../src/services/quoteContext';

/**
 * Quote flow layout — provides transient quote state across all 4 steps.
 */
export default function QuoteLayout() {
  const [quoteState, quoteDispatch] = useReducer(quoteFlowReducer, initialQuoteState);

  return (
    <QuoteFlowContext.Provider value={{ quoteState, quoteDispatch }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      />
    </QuoteFlowContext.Provider>
  );
}
