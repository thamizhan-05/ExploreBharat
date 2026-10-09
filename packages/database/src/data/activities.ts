export interface SeedActivityItem {
  title: string;
  cityName: string;
  category: string;
  durationHours: number;
  pricePerPersonInr: number;
  difficulty: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  included: string[];
  slots: string[];
}

export const authenticActivities: SeedActivityItem[] = [
  {
    title: 'Morning Ganga Sunrise Rowing Boat Tour',
    cityName: 'Varanasi',
    category: 'HERITAGE_WALK',
    durationHours: 2.0,
    pricePerPersonInr: 650,
    difficulty: 'Easy',
    rating: 4.9,
    reviewsCount: 142,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi.jpg/1280px-Dasaswamedh_ghat-varanasi.jpg',
    description: 'Gliding along the holy Ghats at dawn with historical commentary on the life cycles along the sacred river.',
    included: ['Private wooden rowing boat', 'English & Hindi licensed local historian', 'Morning chai'],
    slots: ['05:30 AM', '06:30 AM']
  },
  {
    title: 'Madurai Heritage Culinary Street Walk',
    cityName: 'Madurai',
    category: 'HERITAGE_WALK',
    durationHours: 2.5,
    pricePerPersonInr: 850,
    difficulty: 'Easy',
    rating: 4.9,
    reviewsCount: 95,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Meenakshi_Amman_West_Tower.jpg/1280px-Meenakshi_Amman_West_Tower.jpg',
    description: 'Sample legendary Madurai Jigarthanda, fluffy Kari Dosa, and crispy parottas around the historic four concentric Masi streets.',
    included: ['Local culinary expert guide', 'All food tastings (5 legendary stalls)', 'Bottled mineral water'],
    slots: ['05:00 PM', '07:30 PM']
  }
];
