export interface CategoryData {
  name: string;
  slug: string;
  iconName: string;
  description: string;
}

export const TOURISM_CATEGORIES: CategoryData[] = [
  {
    name: 'Heritage & Forts',
    slug: 'heritage-forts',
    iconName: 'Castle',
    description: 'Ancient royal citadels, Rajput and Maratha hill forts, Mughal palaces, and living heritage.'
  },
  {
    name: 'Religious & Spiritual',
    slug: 'religious-spiritual',
    iconName: 'Flame',
    description: 'Ancient sacred temples, gopurams, mosques, gurudwaras, and pilgrimage sites.'
  },
  {
    name: 'UNESCO & Monuments',
    slug: 'unesco-monuments',
    iconName: 'Landmark',
    description: 'World Heritage architecture, protected archaeological monuments, and historical structures.'
  },
  {
    name: 'Nature & Mountains',
    slug: 'nature-mountains',
    iconName: 'Mountain',
    description: 'Himalayan mountain valleys, tranquil alpine passes, pristine waterfalls, and emerald viewpoints.'
  },
  {
    name: 'Wildlife & Sanctuaries',
    slug: 'wildlife-sanctuaries',
    iconName: 'Trees',
    description: 'Bengal tiger reserves, rhino national parks, and bio-diverse bird sanctuaries.'
  },
  {
    name: 'Beaches & Coastal',
    slug: 'beaches-coastal',
    iconName: 'Waves',
    description: 'Tropical palm-fringed coastlines, Arabian Sea promenades, and serene backwaters.'
  },
  {
    name: 'Food & Local Culture',
    slug: 'food-local-culture',
    iconName: 'Utensils',
    description: 'Authentic regional culinary trails, heritage markets, and indigenous arts and crafts.'
  },
  {
    name: 'Adventure & Trails',
    slug: 'adventure-trails',
    iconName: 'Compass',
    description: 'High-altitude Himalayan trekking, white-water river rafting, and Thar desert expeditions.'
  },
  {
    name: 'Hidden Gems & Eco-stays',
    slug: 'hidden-gems',
    iconName: 'Sparkles',
    description: 'Undiscovered rural villages, peaceful mountain monasteries, and eco-sensitive retreats.'
  }
];
