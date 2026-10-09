const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Data Normalization & Provenance Grounding ---');

  // 1. Remove duplicate Bandra Bandstand items, keeping only the oldest/first
  const bandraDuplicates = await prisma.attraction.findMany({
    where: { name: 'Bandra Bandstand Public Promenade & Amphitheatre' },
    orderBy: { createdAt: 'asc' }
  });

  if (bandraDuplicates.length > 1) {
    const keepId = bandraDuplicates[0].id;
    const removeIds = bandraDuplicates.slice(1).map(b => b.id);
    console.log(`Found ${bandraDuplicates.length} Bandra Bandstand entries. Keeping ${keepId}, deleting ${removeIds.length} duplicates.`);
    
    // Delete dependent relations if any
    await prisma.ticketType.deleteMany({ where: { attractionId: { in: removeIds } } });
    await prisma.ticketSlot.deleteMany({ where: { attractionId: { in: removeIds } } });
    await prisma.review.deleteMany({ where: { targetId: { in: removeIds }, targetType: 'ATTRACTION' } });
    await prisma.attraction.deleteMany({ where: { id: { in: removeIds } } });
  }

  // 2. Identify templated attractions (names containing template suffixes)
  const templateSuffixes = [
    'Ancient Fort & Bastion',
    'Heritage Stepwell & Baori',
    'Sacred Shiva Temple & Kund',
    'Royal Palace & Museum Gallery',
    'Botanical Valley & Viewpoint',
    'Wildlife Safari & Buffer Zone',
    'Rock-Cut Buddhist Caves',
    'Artisan Heritage Craft Bazaar'
  ];

  const allAttractions = await prisma.attraction.findMany();
  let templatedCount = 0;

  for (const attr of allAttractions) {
    const isTemplated = templateSuffixes.some(s => attr.name.endsWith(s));
    if (isTemplated) {
      await prisma.attraction.update({
        where: { id: attr.id },
        data: {
          verificationStatus: 'SAMPLE_DATA',
          feeVerificationStatus: 'UNVERIFIED',
          sourceType: 'DIRECTORY_PREVIEW',
          sourceName: 'ExploreBharat Catalog Sample',
          sourceUrl: null,
          reviewsCount: 0 // Reflect actual reality
        }
      });
      templatedCount++;
    }
  }

  console.log(`Marked ${templatedCount} templated attractions as SAMPLE_DATA with reviewsCount=0.`);

  // 3. For real attractions, sync reviewsCount with actual reviews in DB
  const realAttractions = await prisma.attraction.findMany({
    where: { verificationStatus: { not: 'SAMPLE_DATA' } }
  });

  for (const a of realAttractions) {
    const actualCount = await prisma.review.count({
      where: { targetId: a.id, targetType: 'ATTRACTION' }
    });
    if (a.reviewsCount !== actualCount) {
      await prisma.attraction.update({
        where: { id: a.id },
        data: { reviewsCount: actualCount }
      });
    }
  }
  console.log(`Synced review counts for all ${realAttractions.length} verified/authentic attractions.`);

  console.log('--- Data Normalization Complete ---');
}

main()
  .catch((e) => {
    console.error('Error during normalization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
