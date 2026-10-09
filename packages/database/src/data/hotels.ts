export interface SeedHotelItem {
  name: string;
  officialName: string;
  cityName: string;
  district: string;
  address: string;
  tier: string;
  rating: number;
  price: number;
  priceType: string;
  priceSource: string;
  availabilityStatus: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  hero: string;
  amenities: string[];
  rooms: {
    title: string;
    type: string;
    price: number;
    maxGuests: number;
    breakfast: boolean;
  }[];
}

export const AUTHENTIC_HOTELS: SeedHotelItem[] = [
  // MADURAI HOTELS (REAL)
  {
    name: 'Heritage Madurai',
    officialName: 'Heritage Madurai Resort & Banyan Spa',
    cityName: 'Madurai',
    district: 'Madurai',
    address: '11, Melakkal Main Road, Kochadai, Madurai, Tamil Nadu 625016',
    tier: 'HERITAGE',
    rating: 4.8,
    price: 6500,
    priceType: 'STARTING_FROM',
    priceSource: 'Heritage Madurai Official Tariff 2026',
    availabilityStatus: 'AVAILABLE',
    lat: 9.9395,
    lng: 78.0867,
    phone: '+91 452 238 5455',
    website: 'https://www.heritagemadurai.com',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Heritage_Madurai_Resort_Pool_and_Banyan.jpg/1280px-Heritage_Madurai_Resort_Pool_and_Banyan.jpg',
    amenities: ['Geoffrey Bawa Architecture', 'Olympic-size Swimming Pool', 'Banyan Tree Spa', 'Pure Satvik Dining', 'Complimentary Peacock Walk'],
    rooms: [
      { title: 'Deluxe Heritage Room', type: 'DELUXE', price: 6500, maxGuests: 2, breakfast: true },
      { title: 'Geoffrey Bawa Pool Villa', type: 'SUITE', price: 14500, maxGuests: 3, breakfast: true }
    ]
  },
  {
    name: 'Fortune Pandiyan Hotel Madurai',
    officialName: 'Fortune Pandiyan Hotel - Member ITC Hotel Group',
    cityName: 'Madurai',
    district: 'Madurai',
    address: 'Race Course Road, Madurai, Tamil Nadu 625002',
    tier: 'STANDARD',
    rating: 4.5,
    price: 4200,
    priceType: 'STARTING_FROM',
    priceSource: 'ITC Hotels Official Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 9.9328,
    lng: 78.1402,
    phone: '+91 452 435 6789',
    website: 'https://www.itchotels.com/fortune-pandiyan-madurai',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Fortune_Pandiyan_Hotel_Madurai_Facade.jpg/1280px-Fortune_Pandiyan_Hotel_Madurai_Facade.jpg',
    amenities: ['Outdoor Pool', '24-hour Orchid Multi-cuisine Cafe', 'Silver Oak Lounge', 'Free High-speed Wi-Fi', 'Airport Shuttle'],
    rooms: [
      { title: 'Fortune Standard Room', type: 'EXECUTIVE', price: 4200, maxGuests: 2, breakfast: true },
      { title: 'Fortune Club Suite', type: 'SUITE', price: 7800, maxGuests: 3, breakfast: true }
    ]
  },
  {
    name: 'The Gateway Hotel Pasumalai',
    officialName: 'The Gateway Hotel Pasumalai Madurai - IHCL SeleQtions',
    cityName: 'Madurai',
    district: 'Madurai',
    address: '40, TPK Road, Pasumalai, Madurai, Tamil Nadu 625004',
    tier: 'LUXURY',
    rating: 4.7,
    price: 7800,
    priceType: 'STARTING_FROM',
    priceSource: 'IHCL Taj Group Direct Inventory',
    availabilityStatus: 'AVAILABLE',
    lat: 9.8970,
    lng: 78.0830,
    phone: '+91 452 663 3000',
    website: 'https://www.seleqtionshotels.com/the-gateway-hotel-pasumalai',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Gateway_Hotel_Pasumalai_Madurai_Colonial.jpg/1280px-Gateway_Hotel_Pasumalai_Madurai_Colonial.jpg',
    amenities: ['Colonial Hilltop Estate', 'Ayurvedic Wellness Spa', 'Gadmardeen Panoramic Terrace', 'Tennis Courts', 'Outdoor Pool'],
    rooms: [
      { title: 'Colonial Hill View Room', type: 'DELUXE', price: 7800, maxGuests: 2, breakfast: true },
      { title: 'Heritage Executive Suite', type: 'SUITE', price: 16000, maxGuests: 3, breakfast: true }
    ]
  },

  // JAIPUR HOTELS
  {
    name: 'Rambagh Palace Jaipur',
    officialName: 'Rambagh Palace - The Jewel of Jaipur (Taj Group)',
    cityName: 'Jaipur',
    district: 'Jaipur',
    address: 'Bhawani Singh Road, Jaipur, Rajasthan 302005',
    tier: 'LUXURY',
    rating: 4.9,
    price: 28000,
    priceType: 'STARTING_FROM',
    priceSource: 'Taj Hotels Direct Inventory',
    availabilityStatus: 'AVAILABLE',
    lat: 26.8978,
    lng: 75.8078,
    phone: '+91 141 221 1919',
    website: 'https://www.tajhotels.com/rambagh-palace-jaipur',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Rambagh_Palace_Jaipur_Front_Facade.jpg/1280px-Rambagh_Palace_Jaipur_Front_Facade.jpg',
    amenities: ['Jiva Grande Spa', 'Vintage Car Airport Transfers', 'Polo Lounge', 'Peacock Garden Walks', 'Fine Dining Suvarna Mahal'],
    rooms: [
      { title: 'Palace Garden Room', type: 'DELUXE', price: 28000, maxGuests: 2, breakfast: true },
      { title: 'Maharaja Royal Suite', type: 'ROYAL_HAVELI', price: 75000, maxGuests: 3, breakfast: true }
    ]
  },
  {
    name: 'Shahpura Haveli Heritage Hotel',
    officialName: 'Shahpura Haveli Heritage Stay',
    cityName: 'Jaipur',
    district: 'Jaipur',
    address: 'Amer Road, Subhash Nagar, Jaipur 302016',
    tier: 'HERITAGE',
    rating: 4.7,
    price: 6500,
    priceType: 'STARTING_FROM',
    priceSource: 'Shahpura Hotels Official Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 26.9412,
    lng: 75.8345,
    phone: '+91 141 220 3571',
    website: 'https://www.shahpura.com',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Samode_Haveli_Jaipur_Courtyard.jpg/1280px-Samode_Haveli_Jaipur_Courtyard.jpg',
    amenities: ['Rooftop Swimming Pool', 'Frescoed Haveli Architecture', 'Rajasthani Puppet Shows', 'High-Speed Wi-Fi'],
    rooms: [
      { title: 'Heritage Deluxe Room', type: 'DELUXE', price: 6500, maxGuests: 2, breakfast: true },
      { title: 'Haveli Royal Suite', type: 'SUITE', price: 11500, maxGuests: 4, breakfast: true }
    ]
  },

  // UDAIPUR HOTELS
  {
    name: 'Taj Lake Palace Luxury Resort',
    officialName: 'Taj Lake Palace - Floating Palace on Lake Pichola',
    cityName: 'Udaipur',
    district: 'Udaipur',
    address: 'Lake Pichola, P.O. Box 5, Udaipur, Rajasthan 313001',
    tier: 'LUXURY',
    rating: 4.9,
    price: 32000,
    priceType: 'STARTING_FROM',
    priceSource: 'Taj Hotels Direct Inventory',
    availabilityStatus: 'AVAILABLE',
    lat: 24.5756,
    lng: 73.6800,
    phone: '+91 294 242 0101',
    website: 'https://www.tajhotels.com/taj-lake-palace-udaipur',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Lake_Palace_Udaipur_Rajasthan.jpg/1280px-Lake_Palace_Udaipur_Rajasthan.jpg',
    amenities: ['Private Boat Transfers', 'Floating Jharokhas', 'Jiva Spa Boat', 'Lakeview Fine Dining', 'Astrology Sessions'],
    rooms: [
      { title: 'Luxury Lake View Room', type: 'DELUXE', price: 32000, maxGuests: 2, breakfast: true }
    ]
  },

  // AGRA HOTELS
  {
    name: 'The Oberoi Amarvilas',
    officialName: 'The Oberoi Amarvilas - Unobstructed Taj Mahal Views',
    cityName: 'Agra',
    district: 'Agra',
    address: 'Taj East Gate Road, Agra, Uttar Pradesh 282001',
    tier: 'LUXURY',
    rating: 4.9,
    price: 28000,
    priceType: 'STARTING_FROM',
    priceSource: 'Oberoi Hotels Official Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 27.1695,
    lng: 78.0515,
    phone: '+91 562 223 1515',
    website: 'https://www.oberoihotels.com/hotels-in-agra-amarvilas',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Oberoi_Amarvilas_Agra_Reflecting_Pool.jpg/1280px-Oberoi_Amarvilas_Agra_Reflecting_Pool.jpg',
    amenities: ['Direct Taj Mahal View Balconies', 'Private Golf Cart Transfers', 'Mughal Courtyard Pools', 'Ayurvedic Spa'],
    rooms: [
      { title: 'Premier Taj View Room', type: 'DELUXE', price: 28000, maxGuests: 2, breakfast: true }
    ]
  },

  // VARANASI HOTELS
  {
    name: 'BrijRama Palace Heritage Hotel',
    officialName: 'BrijRama Palace - Heritage Stay on Darbhanga Ghat',
    cityName: 'Varanasi',
    district: 'Varanasi',
    address: 'Darbhanga Ghat, Dashashwamedh, Varanasi 221001',
    tier: 'HERITAGE',
    rating: 4.8,
    price: 14500,
    priceType: 'STARTING_FROM',
    priceSource: 'Brij Hotels Official Rate',
    availabilityStatus: 'AVAILABLE',
    lat: 25.3058,
    lng: 83.0112,
    phone: '+91 542 245 4222',
    website: 'https://www.brijhotels.com/brijrama-palace',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/BrijRama_Palace_Darbhanga_Ghat_Varanasi.jpg/1280px-BrijRama_Palace_Darbhanga_Ghat_Varanasi.jpg',
    amenities: ['Historic Bajra Boat Pick-up', 'Morning Shehnai Recitals', 'Pure Vegetarian Satvik Cuisine', 'Private Ghat Terrace'],
    rooms: [
      { title: 'Varuna Ghat View Room', type: 'DELUXE', price: 14500, maxGuests: 2, breakfast: true }
    ]
  },

  // MUMBAI HOTELS
  {
    name: 'The Taj Mahal Palace Mumbai',
    officialName: 'The Taj Mahal Palace & Tower Mumbai',
    cityName: 'Mumbai',
    district: 'Mumbai City',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
    tier: 'LUXURY',
    rating: 4.9,
    price: 24000,
    priceType: 'STARTING_FROM',
    priceSource: 'Taj Hotels Direct Inventory',
    availabilityStatus: 'AVAILABLE',
    lat: 18.9217,
    lng: 72.8333,
    phone: '+91 22 6665 3366',
    website: 'https://www.tajhotels.com/the-taj-mahal-palace-mumbai',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/The_Taj_Mahal_Palace_Hotel_Mumbai.jpg/1280px-The_Taj_Mahal_Palace_Hotel_Mumbai.jpg',
    amenities: ['Arabian Sea Gateway Views', 'Jiva Spa Wellness', 'Wasabi by Morimoto Restaurant', 'Sea Lounge Afternoon Tea', 'Outdoor Swimming Pool'],
    rooms: [
      { title: 'Luxury Grand Sea View Room', type: 'DELUXE', price: 24000, maxGuests: 2, breakfast: true },
      { title: 'Tata Presidential Suite', type: 'SUITE', price: 95000, maxGuests: 3, breakfast: true }
    ]
  },

  // KOCHI HOTELS
  {
    name: 'Brunton Boatyard Historical Hotel',
    officialName: 'Brunton Boatyard - CGH Earth Historic Hotel',
    cityName: 'Kochi',
    district: 'Ernakulam',
    address: '1/498 Calvethy, Fort Kochi, Kochi, Kerala 682001',
    tier: 'HERITAGE',
    rating: 4.7,
    price: 9800,
    priceType: 'STARTING_FROM',
    priceSource: 'CGH Earth Direct Booking Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 9.9678,
    lng: 76.2429,
    phone: '+91 484 221 5461',
    website: 'https://www.cghearth.com/brunton-boatyard',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Fort_Kochi_Heritage_Waterfront_Hotel.jpg/1280px-Fort_Kochi_Heritage_Waterfront_Hotel.jpg',
    amenities: ['Harbour Seafront Views', 'Ayurvedic Therapy Center', 'Seafood Masterclass Dining', 'Harbourfront Swimming Pool'],
    rooms: [
      { title: 'Sea Facing Heritage Room', type: 'DELUXE', price: 9800, maxGuests: 2, breakfast: true }
    ]
  },

  // MAHABALESHWAR HOTELS
  {
    name: 'Le Méridien Mahabaleshwar Resort & Spa',
    officialName: 'Le Méridien Mahabaleshwar Luxury Forest Retreat',
    cityName: 'Mahabaleshwar',
    district: 'Satara',
    address: '211 / 212, Medha Road, Mahabaleshwar, Maharashtra 412806',
    tier: 'LUXURY',
    rating: 4.8,
    price: 14500,
    priceType: 'STARTING_FROM',
    priceSource: 'Marriott Direct Official Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 17.9298,
    lng: 73.6702,
    phone: '+91 2168 262 222',
    website: 'https://www.marriott.com/hotels/travel/pnqmm-le-meridien-mahabaleshwar-resort-and-spa',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mahabaleshwar_Western_Ghats_Greenery.jpg/1280px-Mahabaleshwar_Western_Ghats_Greenery.jpg',
    amenities: ['Explore Spa Ayurvedic Treatments', 'Infinity Valley Pool', 'Chingari Rooftop Dining', 'Forest Nature Trails'],
    rooms: [
      { title: 'Classic Forest View Room', type: 'DELUXE', price: 14500, maxGuests: 2, breakfast: true },
      { title: 'Serenity Valley Pool Villa', type: 'SUITE', price: 28500, maxGuests: 3, breakfast: true }
    ]
  },
  {
    name: 'Evershine Resort & Spa Mahabaleshwar',
    officialName: 'Evershine Heritage Resort & Convention Centre',
    cityName: 'Mahabaleshwar',
    district: 'Satara',
    address: 'C.T.S No 182, Gautam Borough, Mahabaleshwar 412806',
    tier: 'HERITAGE',
    rating: 4.6,
    price: 6800,
    priceType: 'STARTING_FROM',
    priceSource: 'Evershine Direct Hotel Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 17.9212,
    lng: 73.6554,
    phone: '+91 2168 260 505',
    website: 'https://www.evershineresort.com',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Mahabaleshwar_Valley_Resort_Landscape.jpg/1280px-Mahabaleshwar_Valley_Resort_Landscape.jpg',
    amenities: ['Red Dholpur Stone Architecture', 'Temperature Controlled Pool', 'Strawberry Plantation Tours', 'Rock Garden'],
    rooms: [
      { title: 'Executive Garden Room', type: 'EXECUTIVE', price: 6800, maxGuests: 2, breakfast: true }
    ]
  },

  // NASHIK HOTELS
  {
    name: 'The Gateway Hotel Ambad Nashik',
    officialName: 'The Gateway Hotel Ambad - IHCL SeleQtions',
    cityName: 'Nashik',
    district: 'Nashik',
    address: 'P-17, Mumbai Agra Road, Ambad, Nashik 422010',
    tier: 'LUXURY',
    rating: 4.6,
    price: 5800,
    priceType: 'STARTING_FROM',
    priceSource: 'IHCL SeleQtions Official Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 19.9532,
    lng: 73.7441,
    phone: '+91 253 669 2300',
    website: 'https://www.seleqtionshotels.com/the-gateway-hotel-ambad-nashik',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sula_Vineyards_Nashik_Landscape.jpg/1280px-Sula_Vineyards_Nashik_Landscape.jpg',
    amenities: ['11 Acres of Landscaped Gardens', 'Wine Tasting Lounge', 'Outdoor Swimming Pool', 'Tennis Courts', 'Ayurvedic Spa'],
    rooms: [
      { title: 'Superior Garden View Room', type: 'DELUXE', price: 5800, maxGuests: 2, breakfast: true }
    ]
  },

  // GOA HOTELS
  {
    name: 'Taj Fort Aguada Resort & Spa Goa',
    officialName: 'Taj Fort Aguada Resort & Spa - Coastal Luxury by IHCL',
    cityName: 'Panaji',
    district: 'North Goa',
    address: 'Sinquerim, Candolim, Goa 403515',
    tier: 'LUXURY',
    rating: 4.8,
    price: 18500,
    priceType: 'STARTING_FROM',
    priceSource: 'IHCL Taj Hotels Direct Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 15.4950,
    lng: 73.7680,
    phone: '+91 832 664 5858',
    website: 'https://www.tajhotels.com/taj-fort-aguada-goa',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Taj_Fort_Aguada_Resort_Goa_Beachfront.jpg/1280px-Taj_Fort_Aguada_Resort_Goa_Beachfront.jpg',
    amenities: ['Private Beachfront Access', 'Jiva Spa by the Sea', 'Latitude All-Day Dining', 'Infinity Swimming Pool', 'Water Sports'],
    rooms: [
      { title: 'Superior Sea View Room', type: 'DELUXE', price: 18500, maxGuests: 2, breakfast: true },
      { title: 'Aguada Presidential Sea Villa', type: 'SUITE', price: 48000, maxGuests: 4, breakfast: true }
    ]
  },
  {
    name: 'Ahilya by the Sea Heritage Boutique',
    officialName: 'Ahilya by the Sea - Relais & Châteaux Heritage Homestay',
    cityName: 'Panaji',
    district: 'North Goa',
    address: 'Coco Beach, Dando, Nerul, Goa 403109',
    tier: 'HERITAGE',
    rating: 4.9,
    price: 14500,
    priceType: 'STARTING_FROM',
    priceSource: 'Relais & Châteaux Direct Official Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 15.5020,
    lng: 73.7915,
    phone: '+91 11 4155 1575',
    website: 'https://www.ahilyabythesea.com',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Goa_Heritage_Villa_Fontainhas.jpg/1280px-Goa_Heritage_Villa_Fontainhas.jpg',
    amenities: ['Direct Dolphin Bay Views', 'Two Infinity Pools', 'Treehouse Banyan Spa', 'Fresh Goan Catch Dinners', 'Artisanal Portuguese Decor'],
    rooms: [
      { title: 'Leela Villa Sea Facing Room', type: 'DELUXE', price: 14500, maxGuests: 2, breakfast: true },
      { title: 'Music Room Heritage Suite', type: 'SUITE', price: 24000, maxGuests: 3, breakfast: true }
    ]
  },

  // MUNNAR HOTELS
  {
    name: 'Tea County Munnar KTDC Resort',
    officialName: 'Tea County Munnar - KTDC Premium Hill Resort',
    cityName: 'Munnar',
    district: 'Idukki',
    address: 'KTDC Tea County, Colony Road, Munnar, Kerala 685612',
    tier: 'STANDARD',
    rating: 4.5,
    price: 5200,
    priceType: 'STARTING_FROM',
    priceSource: 'KTDC Official Government Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 10.0825,
    lng: 77.0620,
    phone: '+91 4865 230 460',
    website: 'https://www.ktdc.com/tea-county',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tea_County_Resort_Munnar_Hills.jpg/1280px-Tea_County_Resort_Munnar_Hills.jpg',
    amenities: ['Tea Plantation Views', 'Ayurvedic Massage Therapy', 'Campfire & Live Music', 'Multi-Cuisine Restaurant', 'Guided Nature Treks'],
    rooms: [
      { title: 'Deluxe Valley View Room', type: 'DELUXE', price: 5200, maxGuests: 2, breakfast: true },
      { title: 'Suite Mountain Room', type: 'SUITE', price: 9500, maxGuests: 3, breakfast: true }
    ]
  },

  // ALLEPPEY HOTELS
  {
    name: 'Lake Palace Resort Alleppey Backwaters',
    officialName: 'Lake Palace Resort Alleppey - Island Luxury on Vembanad Lake',
    cityName: 'Alleppey',
    district: 'Alappuzha',
    address: 'Thirumala Ward, Chungam, Alappuzha, Kerala 688011',
    tier: 'LUXURY',
    rating: 4.7,
    price: 9200,
    priceType: 'STARTING_FROM',
    priceSource: 'Lake Palace Resort Official Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 9.5080,
    lng: 76.3520,
    phone: '+91 477 223 9701',
    website: 'https://www.lakepalaceresort.com',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kerala_Backwaters_Resort_Punnamada.jpg/1280px-Kerala_Backwaters_Resort_Punnamada.jpg',
    amenities: ['Private Island on Vembanad Lake', 'Private Motorboat Transfers', 'Ayurvedic Rejuvenation Spa', 'Lakefront Houseboat Dining'],
    rooms: [
      { title: 'Lake View Cottage', type: 'DELUXE', price: 9200, maxGuests: 2, breakfast: true },
      { title: 'Water Villa Overlooking Lagoon', type: 'SUITE', price: 16500, maxGuests: 3, breakfast: true }
    ]
  },

  // UDAIPUR HERITAGE HOTELS
  {
    name: 'Fateh Prakash Palace Udaipur',
    officialName: 'Fateh Prakash Palace - Grand Heritage Hotel on Lake Pichola (HRH Group)',
    cityName: 'Udaipur',
    district: 'Udaipur',
    address: 'The City Palace Complex, Udaipur, Rajasthan 313001',
    tier: 'HERITAGE',
    rating: 4.8,
    price: 16000,
    priceType: 'STARTING_FROM',
    priceSource: 'HRH Group of Hotels Official Tariff',
    availabilityStatus: 'AVAILABLE',
    lat: 24.5750,
    lng: 73.6820,
    phone: '+91 294 252 8016',
    website: 'https://www.hrhhotels.com/grand_heritage/fateh_prakash_palace',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Fateh_Prakash_Palace_Udaipur_Facade.jpg/1280px-Fateh_Prakash_Palace_Udaipur_Facade.jpg',
    amenities: ['The Crystal Gallery Access', 'Sunset Terrace Dining on Lake Pichola', 'Direct Access to City Palace Courtyards', 'Private Lake Cruises'],
    rooms: [
      { title: 'Palace Heritage Room', type: 'DELUXE', price: 16000, maxGuests: 2, breakfast: true },
      { title: 'Premier Lake Facing Suite', type: 'SUITE', price: 34000, maxGuests: 3, breakfast: true }
    ]
  }
];
