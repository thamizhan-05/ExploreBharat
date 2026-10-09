export * from './types';
export * from './states';
export * from './categories';
export * from './cities';
export * from './attractions-madurai';
export * from './attractions-rajasthan';
export * from './attractions-maharashtra';
export * from './attractions-kerala';
export * from './attractions-panindia';
export * from './hotels';
export * from './circuits';
export * from './festivals';
export * from './activities';

import { MADURAI_ATTRACTIONS } from './attractions-madurai';
import { RAJASTHAN_ATTRACTIONS } from './attractions-rajasthan';
import { MAHARASHTRA_ATTRACTIONS } from './attractions-maharashtra';
import { KERALA_ATTRACTIONS } from './attractions-kerala';
import { PANINDIA_ATTRACTIONS } from './attractions-panindia';
import { STATES_AND_UTS } from './states';
import { TOURISM_CATEGORIES } from './categories';
import { TOURIST_CITIES } from './cities';
import { AUTHENTIC_HOTELS } from './hotels';
import { SeedAttractionItem } from './types';

// Backward/convenience aliases
export const statesData = STATES_AND_UTS;
export const categoriesData = TOURISM_CATEGORIES;
export const citiesData = TOURIST_CITIES;
export const authenticHotels = AUTHENTIC_HOTELS;

export const allSeedAttractions: SeedAttractionItem[] = [
  ...MADURAI_ATTRACTIONS,
  ...RAJASTHAN_ATTRACTIONS,
  ...MAHARASHTRA_ATTRACTIONS,
  ...KERALA_ATTRACTIONS,
  ...PANINDIA_ATTRACTIONS
];
