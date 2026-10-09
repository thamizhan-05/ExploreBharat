import { prisma } from './client';

export async function seedEvents() {
  const existing = await prisma.event.count();
  if (existing > 0) {
    console.log(`Events already seeded (${existing} events).`);
    return;
  }

  const jaipur = await prisma.city.findFirst({ where: { name: 'Jaipur' } });
  const mumbai = await prisma.city.findFirst({ where: { name: 'Mumbai' } });
  const panaji = await prisma.city.findFirst({ where: { name: 'Panaji' } });
  const varanasi = await prisma.city.findFirst({ where: { name: 'Varanasi' } });

  const events = [
    {
      name: 'Pushkar Camel & Cultural Fair 2026',
      cityId: jaipur?.id,
      category: 'FAIR',
      startDate: '2026-11-18',
      endDate: '2026-11-26',
      location: 'Pushkar Mela Ground, Ajmer-Jaipur Region',
      description: 'One of the world\'s largest livestock and cultural fairs, featuring colorful Rajasthani folk dances, camel races, and evening Maha Aarti ceremonies at the sacred Pushkar Sarovar.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Pushkar_Fair_Rajasthan.jpg/1280px-Pushkar_Fair_Rajasthan.jpg',
      ticketInfo: 'Free Public Entry (Cultural arena pass optional)',
      officialUrl: 'https://www.tourism.rajasthan.gov.in',
      isFeatured: true
    },
    {
      name: 'Ganesh Utsav & Grand Immersion Procession',
      cityId: mumbai?.id,
      category: 'FESTIVAL',
      startDate: '2026-09-14',
      endDate: '2026-09-24',
      location: 'Girgaon Chowpatty & Lalbaug, Mumbai',
      description: 'The monumental 10-day celebration of Ganeshotsav in Mumbai featuring world-famous mandals including Lalbaugcha Raja, traditional dhol-tasha beats, and massive beach processions.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Ganesh_Festival_Mumbai.jpg/1280px-Ganesh_Festival_Mumbai.jpg',
      ticketInfo: 'Free Entry — Public Cultural Festival',
      officialUrl: 'https://maharashtratourism.gov.in',
      isFeatured: true
    },
    {
      name: 'Goa Heritage & Sun Festival',
      cityId: panaji?.id,
      category: 'CULTURAL',
      startDate: '2026-12-10',
      endDate: '2026-12-14',
      location: 'Campal Promenade & Miramar Beach, Panaji',
      description: 'Annual cultural carnival highlighting Indo-Portuguese architecture, traditional Konkani music, fado singing, artisanal Goan cuisine, and vibrant street parades.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Goa_Carnival_Parade.jpg/1280px-Goa_Carnival_Parade.jpg',
      ticketInfo: 'Free Public Grounds • Registration for Masterclasses',
      officialUrl: 'https://goatourism.gov.in',
      isFeatured: true
    },
    {
      name: 'Dev Deepawali & Grand Ganga Aarti',
      cityId: varanasi?.id,
      category: 'RELIGIOUS',
      startDate: '2026-11-24',
      endDate: '2026-11-24',
      location: 'Dashashwamedh & Assi Ghats, Varanasi',
      description: 'The Festival of Lights of the Gods celebrated fifteen days after Diwali, when all 84 ghats of Varanasi are illuminated with more than a million earthenware lamps (diyas).',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Varanasi_Dev_Deepawali_Ghats.jpg/1280px-Varanasi_Dev_Deepawali_Ghats.jpg',
      ticketInfo: 'Free Ghat Viewing • Boat Cruises Ticketed',
      officialUrl: 'https://uptourism.gov.in',
      isFeatured: true
    }
  ];

  for (const ev of events) {
    await prisma.event.create({ data: ev });
  }

  console.log(`Successfully seeded ${events.length} authentic Indian cultural events.`);
}

if (require.main === module) {
  seedEvents()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
