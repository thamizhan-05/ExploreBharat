export interface SeedCircuitItem {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  coverImageUrl: string;
  recommendedDays: number;
  estimatedCostInr: number;
  destinations: string[];
  highlights: string[];
}

export const authenticCircuits: SeedCircuitItem[] = [
  {
    title: 'The Golden Triangle (Delhi - Agra - Jaipur)',
    slug: 'golden-triangle',
    subtitle: 'Delhi, Agra & Jaipur Heritage Circuit',
    description: 'The quintessential introduction to India’s royal history, architectural wonders, and vibrant markets connecting Delhi, Agra, and Jaipur.',
    coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',
    recommendedDays: 6,
    estimatedCostInr: 32000,
    destinations: ['New Delhi', 'Agra', 'Jaipur'],
    highlights: ['Sunrise at Taj Mahal', 'Amber Fort elephant ride & mirror palace', 'Historic Qutub Minar', 'Fatehpur Sikri red sandstone gate']
  },
  {
    title: 'South India Classical Temple Trail',
    slug: 'south-india-temple-trail',
    subtitle: 'Madurai, Thanjavur & Mahabalipuram Coastal Heritage',
    description: 'Journey through the Dravidian architectural wonders of Tamil Nadu: Meenakshi Amman in Madurai, Brihadisvara in Thanjavur, and Shore Temple in Mahabalipuram.',
    coverImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Meenakshi_Amman_West_Tower.jpg/1280px-Meenakshi_Amman_West_Tower.jpg',
    recommendedDays: 7,
    estimatedCostInr: 28000,
    destinations: ['Madurai', 'Mahabalipuram'],
    highlights: ['Meenakshi Sundareswarar 14 gopurams', 'Thirumalai Nayakkar Palace evening show', 'UNESCO Shore Temple and rock chariots at Mahabalipuram', 'Vandiyur Mariamman Teppakulam float festival site']
  }
];
