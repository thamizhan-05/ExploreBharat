export interface CityData {
  name: string;
  stateCode: string;
  description: string;
  lat: number;
  lng: number;
  bestTime: string;
  imageUrl: string;
  isPopular: boolean;
}

export const TOURIST_CITIES: CityData[] = [
  // TAMIL NADU
  {
    name: 'Madurai',
    stateCode: 'TN',
    description: 'Ancient temple city on the Vaigai River crowned by the monumental Meenakshi Amman Temple and Nayakkar palaces.',
    lat: 9.9252,
    lng: 78.1198,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Meenakshi_Amman_West_Tower.jpg/1280px-Meenakshi_Amman_West_Tower.jpg',
    isPopular: true
  },
  {
    name: 'Chennai',
    stateCode: 'TN',
    description: 'Cultural capital of South India boasting Marina Beach, colonial Fort St. George, and Carnatic music traditions.',
    lat: 13.0827,
    lng: 80.2707,
    bestTime: 'Nov to Feb',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Chennai_Central.jpg/1280px-Chennai_Central.jpg',
    isPopular: true
  },
  {
    name: 'Thanjavur',
    stateCode: 'TN',
    description: 'The ancient capital of the Chola empire renowned for the monolithic granite Brihadisvara Great Living Chola Temple.',
    lat: 10.7870,
    lng: 79.1378,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brihadisvara_Temple_Thanjavur.jpg/1280px-Brihadisvara_Temple_Thanjavur.jpg',
    isPopular: false
  },
  {
    name: 'Mahabalipuram',
    stateCode: 'TN',
    description: 'UNESCO World Heritage coastal town celebrated for 7th-century Pallava rock-cut cave temples and monolithic Shore Temple.',
    lat: 12.6269,
    lng: 80.1927,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Shore_Temple_Mahabalipuram.jpg/1280px-Shore_Temple_Mahabalipuram.jpg',
    isPopular: true
  },

  // RAJASTHAN
  {
    name: 'Jaipur',
    stateCode: 'RJ',
    description: 'The royal Pink City of palaces, hilltop Amber Fort, Hawa Mahal, and vibrant gemstone bazaars.',
    lat: 26.9124,
    lng: 75.7873,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
    isPopular: true
  },
  {
    name: 'Udaipur',
    stateCode: 'RJ',
    description: 'The romantic City of Lakes featuring white marble island palaces on Lake Pichola and the grand City Palace complex.',
    lat: 24.5854,
    lng: 73.7125,
    bestTime: 'Sep to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Udaipur_Lake_India.JPG/1280px-Udaipur_Lake_India.JPG',
    isPopular: true
  },
  {
    name: 'Jodhpur',
    stateCode: 'RJ',
    description: 'The historic Blue City watched over by the formidable clifftop Mehrangarh Fort rising above indigo Brahmin houses.',
    lat: 26.2389,
    lng: 73.0243,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Mehrangarh_Fort_in_Jodhpur.jpg/1280px-Mehrangarh_Fort_in_Jodhpur.jpg',
    isPopular: true
  },
  {
    name: 'Jaisalmer',
    stateCode: 'RJ',
    description: 'The Golden City of the Thar Desert featuring the living sandstone Sonar Qila fort and rolling sand dunes.',
    lat: 26.9157,
    lng: 70.9083,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jaisalmer_Fort_Rajasthan.jpg/1280px-Jaisalmer_Fort_Rajasthan.jpg',
    isPopular: true
  },

  // MAHARASHTRA
  {
    name: 'Mumbai',
    stateCode: 'MH',
    description: 'The Maximum City of financial power, Arabian Sea Marine Drive queen’s necklace, and colonial Gateway of India.',
    lat: 18.9220,
    lng: 72.8347,
    bestTime: 'Nov to Feb',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Gateway_of_India_Mumbai.jpg/1280px-Gateway_of_India_Mumbai.jpg',
    isPopular: true
  },
  {
    name: 'Pune',
    stateCode: 'MH',
    description: 'Cultural capital of Maharashtra nestled against the Western Ghats with historic Maratha forts and educational institutions.',
    lat: 18.5204,
    lng: 73.8567,
    bestTime: 'Jul to Feb',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Shaniwar_Wada_Pune_Entrance.jpg/1280px-Shaniwar_Wada_Pune_Entrance.jpg',
    isPopular: true
  },
  {
    name: 'Chhatrapati Sambhajinagar',
    stateCode: 'MH',
    description: 'Gateway to the monumental UNESCO rock-cut wonders of the ancient Buddhist Ajanta and Hindu-Jain Ellora caves.',
    lat: 19.8762,
    lng: 75.3433,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ellora_Kailash_temple.jpg/1280px-Ellora_Kailash_temple.jpg',
    isPopular: false
  },
  {
    name: 'Mahabaleshwar',
    stateCode: 'MH',
    description: 'Picturesque hill retreat in the Western Ghats renowned for Arthur Seat clifftops, Pratapgad Maratha fortress, Venna Lake, and strawberry valleys.',
    lat: 17.9237,
    lng: 73.6586,
    bestTime: 'Oct to Jun',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Arthur%27s_Seat_Mahabaleshwar.jpg/1280px-Arthur%27s_Seat_Mahabaleshwar.jpg',
    isPopular: true
  },
  {
    name: 'Nashik',
    stateCode: 'MH',
    description: 'Ancient pilgrim capital on the Godavari River housing the Trimbakeshwar Jyotirlinga, Pandavleni Buddhist caves, and premier Indian vineyards.',
    lat: 19.9975,
    lng: 73.7898,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Trimbakeshwar_Temple_Nashik.jpg/1280px-Trimbakeshwar_Temple_Nashik.jpg',
    isPopular: true
  },

  // DELHI
  {
    name: 'New Delhi',
    stateCode: 'DL',
    description: 'National capital where Mughal monuments, India Gate, Qutub Minar, and vibrant culinary bazaars converge.',
    lat: 28.6139,
    lng: 77.2090,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/India_Gate_in_New_Delhi_03-2016.jpg/1280px-India_Gate_in_New_Delhi_03-2016.jpg',
    isPopular: true
  },

  // UTTAR PRADESH
  {
    name: 'Agra',
    stateCode: 'UP',
    description: 'Mughal imperial city on the Yamuna hosting the world-famous white marble Taj Mahal and majestic Agra Fort.',
    lat: 27.1767,
    lng: 78.0081,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',
    isPopular: true
  },
  {
    name: 'Varanasi',
    stateCode: 'UP',
    description: 'One of the world’s oldest continuously inhabited sacred cities famed for spiritual Ganga Aarti along historic stone ghats.',
    lat: 25.3176,
    lng: 82.9739,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Varanasi_Ghats_Evening_Aarti.jpg/1280px-Varanasi_Ghats_Evening_Aarti.jpg',
    isPopular: true
  },

  // KERALA
  {
    name: 'Kochi',
    stateCode: 'KL',
    description: 'Queen of the Arabian Sea featuring cantilevered Chinese fishing nets, Jewish Synagogue, and colonial Portuguese spice quarters.',
    lat: 9.9312,
    lng: 76.2673,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Chinese_Fishing_Nets_Kochi.jpg/1280px-Chinese_Fishing_Nets_Kochi.jpg',
    isPopular: true
  },
  {
    name: 'Munnar',
    stateCode: 'KL',
    description: 'Idyllic emerald hill station in the Western Ghats blanketed by rolling tea gardens and home to the endangered Nilgiri Tahr.',
    lat: 10.0889,
    lng: 77.0595,
    bestTime: 'Sep to May',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Munnar_Tea_Plantations_Kerala.jpg/1280px-Munnar_Tea_Plantations_Kerala.jpg',
    isPopular: true
  },
  {
    name: 'Alleppey',
    stateCode: 'KL',
    description: 'Venice of the East known for its tranquil labyrinth of palm-fringed backwater canals and traditional kettuvallam houseboats.',
    lat: 9.4981,
    lng: 76.3388,
    bestTime: 'Nov to Feb',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Houseboat_in_Kerala.jpg/1280px-Houseboat_in_Kerala.jpg',
    isPopular: true
  },

  // GOA
  {
    name: 'Panaji',
    stateCode: 'GA',
    description: 'Capital of Goa nestled along the Mandovi River with colorful Portuguese Latin Quarter Fontainhas and heritage churches.',
    lat: 15.4909,
    lng: 73.8278,
    bestTime: 'Nov to Feb',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Basilica_of_Bom_Jesus_in_Goa.jpg/1280px-Basilica_of_Bom_Jesus_in_Goa.jpg',
    isPopular: true
  },

  // KARNATAKA
  {
    name: 'Mysuru',
    stateCode: 'KA',
    description: 'City of Palaces celebrated for the illuminated Mysore Palace, sandalwood craft, and vibrant Dasara royal festivities.',
    lat: 12.2958,
    lng: 76.6394,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Mysore_Palace_Morning.jpg/1280px-Mysore_Palace_Morning.jpg',
    isPopular: true
  },
  {
    name: 'Hampi',
    stateCode: 'KA',
    description: 'UNESCO World Heritage boulder-strewn capital ruins of the 14th-century Vijayanagara Empire along the Tungabhadra River.',
    lat: 15.3350,
    lng: 76.4600,
    bestTime: 'Oct to Feb',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_virupaksha_temple.jpg/1280px-Hampi_virupaksha_temple.jpg',
    isPopular: true
  },

  // PUNJAB
  {
    name: 'Amritsar',
    stateCode: 'PB',
    description: 'Spiritual epicenter of Sikhism home to the gleaming Harmandir Sahib (Golden Temple) and historic Jallianwala Bagh.',
    lat: 31.6340,
    lng: 74.8723,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Golden_Temple_Amritsar_India.jpg/1280px-Golden_Temple_Amritsar_India.jpg',
    isPopular: true
  },

  // LADAKH
  {
    name: 'Leh',
    stateCode: 'LA',
    description: 'High-altitude Himalayan oasis boasting Tibetan Buddhist clifftop gompas, vibrant stupas, and trans-Himalayan passes.',
    lat: 34.1526,
    lng: 77.5771,
    bestTime: 'May to Sep',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Pangong_Tso_Ladakh.jpg/1280px-Pangong_Tso_Ladakh.jpg',
    isPopular: true
  },

  // ODISHA
  {
    name: 'Puri',
    stateCode: 'OD',
    description: 'Sacred coastal Char Dham holy city famous for the monumental Jagannath Temple, golden sea beach, and annual Rath Yatra.',
    lat: 19.8135,
    lng: 85.8312,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Konark_Sun_Temple_Wheel.jpg/1280px-Konark_Sun_Temple_Wheel.jpg',
    isPopular: true
  },

  // WEST BENGAL
  {
    name: 'Kolkata',
    stateCode: 'WB',
    description: 'City of Joy featuring the grand white marble Victoria Memorial, Howrah Bridge over the Hooghly, and rich literary heritage.',
    lat: 22.5726,
    lng: 88.3639,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_Kolkata_sunset.jpg/1280px-Victoria_Memorial_Kolkata_sunset.jpg',
    isPopular: true
  },

  // PUDUCHERRY
  {
    name: 'Puducherry',
    stateCode: 'PY',
    description: 'Former French colonial coastal enclave of tree-lined boulevards, chic cafes, Sri Aurobindo Ashram, and experimental Auroville.',
    lat: 11.9416,
    lng: 79.8083,
    bestTime: 'Oct to Mar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/French_Quarter_Pondicherry.jpg/1280px-French_Quarter_Pondicherry.jpg',
    isPopular: true
  }
];
