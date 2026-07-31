/**
 * Airport data for the quote flow origin/destination selector.
 * Covers UK departure airports and popular pet transport destinations.
 */

export interface Airport {
  code: string;
  city: string;
  country: string;
  /** For search/autocomplete */
  searchTerms: string;
}

export const AIRPORTS: Airport[] = [
  // UK (origin)
  { code: 'LHR', city: 'London Heathrow', country: 'United Kingdom', searchTerms: 'london heathrow lhr uk' },
  { code: 'LGW', city: 'London Gatwick', country: 'United Kingdom', searchTerms: 'london gatwick lgw uk' },
  { code: 'MAN', city: 'Manchester', country: 'United Kingdom', searchTerms: 'manchester man uk' },
  { code: 'STN', city: 'London Stansted', country: 'United Kingdom', searchTerms: 'london stansted stn uk' },
  { code: 'EDI', city: 'Edinburgh', country: 'United Kingdom', searchTerms: 'edinburgh edi scotland uk' },
  { code: 'BHX', city: 'Birmingham', country: 'United Kingdom', searchTerms: 'birmingham bhx uk' },

  // USA
  { code: 'JFK', city: 'New York JFK', country: 'United States', searchTerms: 'new york jfk usa us america' },
  { code: 'LAX', city: 'Los Angeles', country: 'United States', searchTerms: 'los angeles lax usa us california' },
  { code: 'MIA', city: 'Miami', country: 'United States', searchTerms: 'miami mia usa us florida' },
  { code: 'SFO', city: 'San Francisco', country: 'United States', searchTerms: 'san francisco sfo usa us california' },
  { code: 'ORD', city: 'Chicago O\'Hare', country: 'United States', searchTerms: 'chicago ord ohare usa us' },

  // Africa
  { code: 'JNB', city: 'Johannesburg', country: 'South Africa', searchTerms: 'johannesburg jnb south africa za' },
  { code: 'CPT', city: 'Cape Town', country: 'South Africa', searchTerms: 'cape town cpt south africa za' },
  { code: 'DUR', city: 'Durban', country: 'South Africa', searchTerms: 'durban dur south africa za' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', searchTerms: 'nairobi nbo kenya africa' },

  // Middle East
  { code: 'DXB', city: 'Dubai', country: 'UAE', searchTerms: 'dubai dxb uae emirates' },
  { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', searchTerms: 'abu dhabi auh uae' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', searchTerms: 'doha doh qatar' },

  // Asia Pacific
  { code: 'SYD', city: 'Sydney', country: 'Australia', searchTerms: 'sydney syd australia au' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', searchTerms: 'melbourne mel australia au' },
  { code: 'AKL', city: 'Auckland', country: 'New Zealand', searchTerms: 'auckland akl new zealand nz' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', searchTerms: 'singapore sin' },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', searchTerms: 'hong kong hkg' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', searchTerms: 'bangkok bkk thailand' },

  // Europe
  { code: 'CDG', city: 'Paris CDG', country: 'France', searchTerms: 'paris cdg france eu' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', searchTerms: 'amsterdam ams netherlands holland eu' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', searchTerms: 'frankfurt fra germany eu' },
  { code: 'MAD', city: 'Madrid', country: 'Spain', searchTerms: 'madrid mad spain eu' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', searchTerms: 'barcelona bcn spain eu' },
  { code: 'FCO', city: 'Rome', country: 'Italy', searchTerms: 'rome fco italy eu' },
  { code: 'LIS', city: 'Lisbon', country: 'Portugal', searchTerms: 'lisbon lis portugal eu' },
  { code: 'ATH', city: 'Athens', country: 'Greece', searchTerms: 'athens ath greece eu' },

  // Americas
  { code: 'YYZ', city: 'Toronto', country: 'Canada', searchTerms: 'toronto yyz canada' },
  { code: 'GRU', city: 'São Paulo', country: 'Brazil', searchTerms: 'sao paulo gru brazil' },
];

/**
 * Search airports by query (code, city, country).
 */
export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return AIRPORTS.filter((a) =>
    a.searchTerms.includes(q) ||
    a.code.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q)
  ).slice(0, 8);
}

/**
 * Popular routes for quick selection on the quote screen.
 */
export const POPULAR_ROUTES = [
  { from: 'LHR', fromCity: 'London', to: 'JNB', toCity: 'Johannesburg' },
  { from: 'LHR', fromCity: 'London', to: 'CPT', toCity: 'Cape Town' },
  { from: 'LHR', fromCity: 'London', to: 'JFK', toCity: 'New York' },
  { from: 'LHR', fromCity: 'London', to: 'LAX', toCity: 'Los Angeles' },
  { from: 'LHR', fromCity: 'London', to: 'SYD', toCity: 'Sydney' },
  { from: 'LHR', fromCity: 'London', to: 'DXB', toCity: 'Dubai' },
  { from: 'LHR', fromCity: 'London', to: 'AKL', toCity: 'Auckland' },
  { from: 'LHR', fromCity: 'London', to: 'SIN', toCity: 'Singapore' },
];
