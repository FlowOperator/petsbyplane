/**
 * Pets by Plane — Quote Flow Context
 *
 * Holds transient state during the 4-step quote funnel.
 * Not persisted — only lives while the user is in the quote flow.
 */

import { createContext, useContext } from 'react';
import { QuoteSearchParams, SelectedFlight } from './quoteService';

export interface QuoteFlowState {
  searchParams: QuoteSearchParams | null;
  selectedFlight: SelectedFlight | null;
  selectedAddOns: string[];
}

export const initialQuoteState: QuoteFlowState = {
  searchParams: null,
  selectedFlight: null,
  selectedAddOns: [],
};

export type QuoteFlowAction =
  | { type: 'SET_SEARCH_PARAMS'; payload: QuoteSearchParams }
  | { type: 'SET_SELECTED_FLIGHT'; payload: SelectedFlight }
  | { type: 'TOGGLE_ADDON'; payload: string }
  | { type: 'RESET' };

export function quoteFlowReducer(state: QuoteFlowState, action: QuoteFlowAction): QuoteFlowState {
  switch (action.type) {
    case 'SET_SEARCH_PARAMS':
      return { ...state, searchParams: action.payload };
    case 'SET_SELECTED_FLIGHT':
      return { ...state, selectedFlight: action.payload };
    case 'TOGGLE_ADDON': {
      const addOns = state.selectedAddOns.includes(action.payload)
        ? state.selectedAddOns.filter((id) => id !== action.payload)
        : [...state.selectedAddOns, action.payload];
      return { ...state, selectedAddOns: addOns };
    }
    case 'RESET':
      return initialQuoteState;
    default:
      return state;
  }
}

export interface QuoteFlowContextValue {
  quoteState: QuoteFlowState;
  quoteDispatch: React.Dispatch<QuoteFlowAction>;
}

export const QuoteFlowContext = createContext<QuoteFlowContextValue>({
  quoteState: initialQuoteState,
  quoteDispatch: () => {},
});

export function useQuoteFlow() {
  return useContext(QuoteFlowContext);
}
