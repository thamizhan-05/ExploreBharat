export interface SeedFestivalItem {
  name: string;
  cityName: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  imageUrl: string;
  ticketInfo: string;
  officialUrl: string;
  isFeatured: boolean;
}

export const authenticFestivals: SeedFestivalItem[] = [
  {
    name: 'Chithirai Festival Madurai',
    cityName: 'Madurai',
    category: 'FESTIVAL',
    startDate: '2026-04-20',
    endDate: '2026-05-02',
    location: 'Meenakshi Amman Temple & Vaigai River, Madurai',
    description: 'One of South India’s largest annual festivals celebrating the celestial wedding of Goddess Meenakshi and Sundareswarar, followed by Lord Alagar’s historic entry into the Vaigai River.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Madurai_Chithirai_Thiruvizha_Alagar_Aatril_Iranguthal.jpg/1280px-Madurai_Chithirai_Thiruvizha_Alagar_Aatril_Iranguthal.jpg',
    ticketInfo: 'Free Public Event',
    officialUrl: 'https://maduraimeenakshi.hrce.tn.gov.in',
    isFeatured: true
  },
  {
    name: 'Pushkar Camel & Cultural Fair',
    cityName: 'Jaipur',
    category: 'FAIR',
    startDate: '2026-11-12',
    endDate: '2026-11-20',
    location: 'Pushkar Mela Ground, Ajmer District, Rajasthan',
    description: 'A world-renowned annual multi-day livestock fair and cultural spectacle featuring folk performances, camel races, and Kartik Purnima holy dips.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Pushkar_Camel_Fair_Rajasthan.jpg/1280px-Pushkar_Camel_Fair_Rajasthan.jpg',
    ticketInfo: 'Free Admission / VIP Arena ₹250',
    officialUrl: 'https://www.tourism.rajasthan.gov.in',
    isFeatured: true
  },
  {
    name: 'Ganesh Chaturthi Mahotsav',
    cityName: 'Mumbai',
    category: 'CULTURAL',
    startDate: '2026-09-14',
    endDate: '2026-09-24',
    location: 'Lalbaugcha Raja & Girgaon Chowpatty, Mumbai',
    description: 'Mumbai’s grandest 10-day cultural and spiritual festival marked by majestic pandals, traditional dhol tasha troupes, and beach immersion processions.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lalbaugcha_Raja_Ganesh_Chaturthi.jpg/1280px-Lalbaugcha_Raja_Ganesh_Chaturthi.jpg',
    ticketInfo: 'Free Public Darshan',
    officialUrl: 'https://www.lalbaugcharaja.com',
    isFeatured: true
  },
  {
    name: 'Teej Festival of Rajasthan',
    cityName: 'Jaipur',
    category: 'FESTIVAL',
    startDate: '2026-08-04',
    endDate: '2026-08-06',
    location: 'City Palace to Talkatora, Jaipur',
    description: 'The royal procession of Goddess Parvati through the Pink City with antique palanquins, caparisoned elephants, folk dancers, and decorated swings.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Teej_Festival_Procession_Jaipur.jpg/1280px-Teej_Festival_Procession_Jaipur.jpg',
    ticketInfo: 'Free Street Procession',
    officialUrl: 'https://www.tourism.rajasthan.gov.in',
    isFeatured: false
  }
];
