export interface StateData {
  name: string;
  code: string;
  isUnionTerritory: boolean;
  capital: string;
  description: string;
  imageUrl: string;
}

export const STATES_AND_UTS: StateData[] = [
  // 28 STATES
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    isUnionTerritory: false,
    capital: 'Amaravati',
    description: 'Spiritual heart of South India with Tirupati Balaji, ancient Buddhist sites at Amaravati, and coastal beauty of Araku Valley.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1280px-Tirumala_090615.jpg'
  },
  {
    name: 'Arunachal Pradesh',
    code: 'AR',
    isUnionTerritory: false,
    capital: 'Itanagar',
    description: 'The Land of Dawn-Lit Mountains featuring Tawang Monastery, pristine alpine passes, and indigenous tribal heritage.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Tawang_Monastery%2C_Arunachal_Pradesh.jpg/1280px-Tawang_Monastery%2C_Arunachal_Pradesh.jpg'
  },
  {
    name: 'Assam',
    code: 'AS',
    isUnionTerritory: false,
    capital: 'Dispur',
    description: 'Home of the one-horned rhinoceros at Kaziranga, sprawling tea estates, and the mighty Brahmaputra river island of Majuli.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rhino_in_Kaziranga.jpg/1280px-Rhino_in_Kaziranga.jpg'
  },
  {
    name: 'Bihar',
    code: 'BR',
    isUnionTerritory: false,
    capital: 'Patna',
    description: 'Cradle of ancient religions where Gautama Buddha attained enlightenment at Bodh Gaya and Mahavira founded Jainism.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mahabodhi_Temple_Bodhgaya_front.jpg/1280px-Mahabodhi_Temple_Bodhgaya_front.jpg'
  },
  {
    name: 'Chhattisgarh',
    code: 'CG',
    isUnionTerritory: false,
    capital: 'Raipur',
    description: 'India’s green lung featuring Chitrakote Niagara-of-India waterfalls, Bastar tribal arts, and ancient cave formations.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chitrakote_Waterfalls.jpg/1280px-Chitrakote_Waterfalls.jpg'
  },
  {
    name: 'Goa',
    code: 'GA',
    isUnionTerritory: false,
    capital: 'Panaji',
    description: 'Sun-kissed Arabian Sea beaches, Portuguese colonial architecture in Old Goa, and rich spice plantation biodiversity.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Basilica_of_Bom_Jesus_in_Goa.jpg/1280px-Basilica_of_Bom_Jesus_in_Goa.jpg'
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    isUnionTerritory: false,
    capital: 'Gandhinagar',
    description: 'The Great Rann of Kutch white salt desert, Asiatic lion sanctuary at Gir, and the world’s tallest Statue of Unity.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Rann_of_kutch.jpg/1280px-Rann_of_kutch.jpg'
  },
  {
    name: 'Haryana',
    code: 'HR',
    isUnionTerritory: false,
    capital: 'Chandigarh',
    description: 'Land of historic Kurukshetra where the Bhagavad Gita was delivered, and vibrant crafts fair at Surajkund.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Brahma_Sarovar_Kurukshetra.jpg/1280px-Brahma_Sarovar_Kurukshetra.jpg'
  },
  {
    name: 'Himachal Pradesh',
    code: 'HP',
    isUnionTerritory: false,
    capital: 'Shimla',
    description: 'Majestic snow-capped Himalayas, colonial toy trains, spiritual Dharamshala, and adventure sports of Manali.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Shimla_ridge.jpg/1280px-Shimla_ridge.jpg'
  },
  {
    name: 'Jharkhand',
    code: 'JH',
    isUnionTerritory: false,
    capital: 'Ranchi',
    description: 'Land of forested waterfalls (Hundru, Dassam), sacred Baidyanath Jyotirlinga, and Betla National Park wildlife.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Hundru_Falls_Ranchi.jpg/1280px-Hundru_Falls_Ranchi.jpg'
  },
  {
    name: 'Karnataka',
    code: 'KA',
    isUnionTerritory: false,
    capital: 'Bengaluru',
    description: 'Vijayanagara empire ruins at UNESCO Hampi, regal palaces of Mysuru, and coffee estates of Coorg.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_virupaksha_temple.jpg/1280px-Hampi_virupaksha_temple.jpg'
  },
  {
    name: 'Kerala',
    code: 'KL',
    isUnionTerritory: false,
    capital: 'Thiruvananthapuram',
    description: 'God’s Own Country featuring emerald backwaters of Alleppey, Ayurvedic retreats, and misty tea hills of Munnar.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Houseboat_in_Kerala.jpg/1280px-Houseboat_in_Kerala.jpg'
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    isUnionTerritory: false,
    capital: 'Bhopal',
    description: 'Heart of India with erotic sculpture temples at Khajuraho, Sanchi stupa, and tiger reserves of Kanha and Bandhavgarh.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Kandariya_Mahadeva_Temple.jpg/1280px-Kandariya_Mahadeva_Temple.jpg'
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    isUnionTerritory: false,
    capital: 'Mumbai',
    description: 'Gateway of India, UNESCO rock-cut caves of Ajanta & Ellora, and Maratha mountain hill forts of Shivaji Maharaj.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Gateway_of_India_Mumbai.jpg/1280px-Gateway_of_India_Mumbai.jpg'
  },
  {
    name: 'Manipur',
    code: 'MN',
    isUnionTerritory: false,
    capital: 'Imphal',
    description: 'Jewel of India featuring the world’s only floating national park on Loktak Lake and classical Manipuri dance.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Loktak_Lake_Manipur.jpg/1280px-Loktak_Lake_Manipur.jpg'
  },
  {
    name: 'Meghalaya',
    code: 'ML',
    isUnionTerritory: false,
    capital: 'Shillong',
    description: 'Abode of clouds boasting bioengineered living root bridges of Cherrapunji and crystal-clear waters of Dawki.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Living_Root_Bridge_Meghalaya.jpg/1280px-Living_Root_Bridge_Meghalaya.jpg'
  },
  {
    name: 'Mizoram',
    code: 'MZ',
    isUnionTerritory: false,
    capital: 'Aizawl',
    description: 'Serene rolling blue hills, bamboo dance festivals, and vibrant handloom traditions of the Mizo people.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Vantawng_Falls_Mizoram.jpg/1280px-Vantawng_Falls_Mizoram.jpg'
  },
  {
    name: 'Nagaland',
    code: 'NL',
    isUnionTerritory: false,
    capital: 'Kohima',
    description: 'Land of warrior festivals celebrated through the famous Hornbill Festival and scenic emerald trekking in Dzukou Valley.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Hornbill_Festival_Nagaland.jpg/1280px-Hornbill_Festival_Nagaland.jpg'
  },
  {
    name: 'Odisha',
    code: 'OD',
    isUnionTerritory: false,
    capital: 'Bhubaneswar',
    description: 'Architectural Sun Temple chariot at Konark, sacred Puri Jagannath Rath Yatra, and dolphin haven at Chilika Lake.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Konark_Sun_Temple_Wheel.jpg/1280px-Konark_Sun_Temple_Wheel.jpg'
  },
  {
    name: 'Punjab',
    code: 'PB',
    isUnionTerritory: false,
    capital: 'Chandigarh',
    description: 'Golden Temple of Amritsar symbolizing spiritual unity, sacred community langar, and patriotic Wagah Border ceremony.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Golden_Temple_Amritsar_India.jpg/1280px-Golden_Temple_Amritsar_India.jpg'
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    isUnionTerritory: false,
    capital: 'Jaipur',
    description: 'Land of Rajput maharajas, magnificent hill forts, pink and golden desert cities, and Thar desert safaris.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg/1280px-20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg'
  },
  {
    name: 'Sikkim',
    code: 'SK',
    isUnionTerritory: false,
    capital: 'Gangtok',
    description: 'Himalayan paradise framed by Mount Kangchenjunga, high-altitude glacial lake Tsomgo, and Buddhist monasteries.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Rumtek_Monastery_Sikkim.jpg/1280px-Rumtek_Monastery_Sikkim.jpg'
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    isUnionTerritory: false,
    capital: 'Chennai',
    description: 'Dravidian gopuram temples of Madurai and Thanjavur, shore temples of Mahabalipuram, and colonial hill stations of Nilgiris.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Meenakshi_Amman_West_Tower.jpg/1280px-Meenakshi_Amman_West_Tower.jpg'
  },
  {
    name: 'Telangana',
    code: 'TS',
    isUnionTerritory: false,
    capital: 'Hyderabad',
    description: 'Historic Charminar, diamond fort of Golconda, UNESCO Ramappa Temple, and rich Nizami culinary culture.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg'
  },
  {
    name: 'Tripura',
    code: 'TR',
    isUnionTerritory: false,
    capital: 'Agartala',
    description: 'Royal water palace of Neermahal, Ujjayanta Palace, and massive ancient rock carvings at Unakoti.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Neermahal_Tripura.jpg/1280px-Neermahal_Tripura.jpg'
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    isUnionTerritory: false,
    capital: 'Lucknow',
    description: 'The monumental white marble Taj Mahal in Agra, sacred Ganga ghats of Varanasi, and royal Awadhi heritage in Lucknow.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg'
  },
  {
    name: 'Uttarakhand',
    code: 'UK',
    isUnionTerritory: false,
    capital: 'Dehradun',
    description: 'Devbhoomi (Land of Gods) with Char Dham pilgrimage, yoga capital Rishikesh, and Himalayan Valley of Flowers.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Kedarnath_Temple_Uttarakhand.jpg/1280px-Kedarnath_Temple_Uttarakhand.jpg'
  },
  {
    name: 'West Bengal',
    code: 'WB',
    isUnionTerritory: false,
    capital: 'Kolkata',
    description: 'Colonial Victoria Memorial, mangrove delta tiger sanctuary of Sundarbans, and misty Darjeeling tea slopes.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_Kolkata_sunset.jpg/1280px-Victoria_Memorial_Kolkata_sunset.jpg'
  },

  // 8 UNION TERRITORIES
  {
    name: 'Andaman and Nicobar Islands',
    code: 'AN',
    isUnionTerritory: true,
    capital: 'Port Blair',
    description: 'Historic Cellular Jail, turquoise coral atolls of Havelock, and Radhanagar Beach sunsets.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Cellular_Jail_Port_Blair.jpg/1280px-Cellular_Jail_Port_Blair.jpg'
  },
  {
    name: 'Chandigarh',
    code: 'CH',
    isUnionTerritory: true,
    capital: 'Chandigarh',
    description: 'Le Corbusier modernist planned city featuring the creative recycled Rock Garden and tranquil Sukhna Lake.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Rock_Garden_Chandigarh.jpg/1280px-Rock_Garden_Chandigarh.jpg'
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    code: 'DN',
    isUnionTerritory: true,
    capital: 'Daman',
    description: 'Portuguese coastal fortresses, sea-facing ramparts of Diu, and palm-fringed quiet beaches.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Diu_Fort_Ramparts.jpg/1280px-Diu_Fort_Ramparts.jpg'
  },
  {
    name: 'Delhi',
    code: 'DL',
    isUnionTerritory: true,
    capital: 'New Delhi',
    description: 'India’s historic national capital spanning Mughal red sandstone citadels, Qutub Minar, and Lutyens architectural grandeur.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/India_Gate_in_New_Delhi_03-2016.jpg/1280px-India_Gate_in_New_Delhi_03-2016.jpg'
  },
  {
    name: 'Jammu and Kashmir',
    code: 'JK',
    isUnionTerritory: true,
    capital: 'Srinagar',
    description: 'Paradise on Earth with Dal Lake wooden shikaras, snow-covered Gulmarg slopes, and Mughal pleasure gardens.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Dal_Lake_Srinagar_Kashmir.jpg/1280px-Dal_Lake_Srinagar_Kashmir.jpg'
  },
  {
    name: 'Ladakh',
    code: 'LA',
    isUnionTerritory: true,
    capital: 'Leh',
    description: 'High-altitude cold desert trans-Himalayan plateau, deep blue Pangong Tso, and clifftop Buddhist gompas.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Pangong_Tso_Ladakh.jpg/1280px-Pangong_Tso_Ladakh.jpg'
  },
  {
    name: 'Lakshadweep',
    code: 'LD',
    isUnionTerritory: true,
    capital: 'Kavaratti',
    description: 'Untouched Arabian Sea coral reef atolls, turquoise lagoons of Bangaram, and world-class scuba diving.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Bangaram_Island_Lakshadweep.jpg/1280px-Bangaram_Island_Lakshadweep.jpg'
  },
  {
    name: 'Puducherry',
    code: 'PY',
    isUnionTerritory: true,
    capital: 'Pondicherry',
    description: 'French colonial White Town boulevards, peaceful Sri Aurobindo Ashram, and universal township of Auroville.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/French_Quarter_Pondicherry.jpg/1280px-French_Quarter_Pondicherry.jpg'
  }
];
