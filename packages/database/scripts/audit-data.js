// Read-only data quality audit of the current dev database.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const attractions = await prisma.attraction.findMany({
    select: { id: true, name: true, heroImageUrl: true, galleryImages: true, latitude: true, longitude: true,
      entryType: true, ticketRequired: true, sourceUrl: true, verificationStatus: true, feeVerificationStatus: true,
      isHiddenGem: true, rating: true, reviewsCount: true, cityId: true, openingTime: true, closingTime: true, entryFee: true, adultIndianFee: true }
  });
  const byImg = {};
  for (const a of attractions) (byImg[a.heroImageUrl] ||= []).push(a.name);
  const dupImgs = Object.entries(byImg).filter(([, v]) => v.length > 1);
  const byName = {};
  for (const a of attractions) (byName[a.name.toLowerCase().replace(/[^a-z0-9]/g, '')] ||= []).push(a.name);
  const dupNames = Object.entries(byName).filter(([, v]) => v.length > 1);
  const byCoord = {};
  for (const a of attractions) (byCoord[`${a.latitude.toFixed(3)},${a.longitude.toFixed(3)}`] ||= []).push(a.name);
  const dupCoords = Object.entries(byCoord).filter(([, v]) => v.length > 1);

  const realReviews = await prisma.review.count();
  const reviewsCountSum = attractions.reduce((s, a) => s + a.reviewsCount, 0);
  const hotels = await prisma.hotel.findMany({ select: { name: true, heroImageUrl: true, startingPriceInr: true } });
  const hotelImgs = {};
  for (const h of hotels) (hotelImgs[h.heroImageUrl] ||= []).push(h.name);

  const out = {
    attractions: attractions.length,
    noSourceUrl: attractions.filter(a => !a.sourceUrl).length,
    verificationStatus: attractions.reduce((m, a) => ((m[a.verificationStatus] = (m[a.verificationStatus] || 0) + 1), m), {}),
    feeVerificationStatus: attractions.reduce((m, a) => ((m[a.feeVerificationStatus] = (m[a.feeVerificationStatus] || 0) + 1), m), {}),
    entryType: attractions.reduce((m, a) => ((m[a.entryType] = (m[a.entryType] || 0) + 1), m), {}),
    freeButTicketRequired: attractions.filter(a => a.entryType === 'FREE' && a.ticketRequired).map(a => a.name),
    paidNoFee: attractions.filter(a => a.entryType === 'PAID' && !a.entryFee && !a.adultIndianFee).length,
    defaultHours: attractions.filter(a => a.openingTime === '09:00 AM' && a.closingTime === '05:30 PM').length,
    unsplashHero: attractions.filter(a => a.heroImageUrl.includes('unsplash')).length,
    duplicateHeroImageGroups: dupImgs.length,
    attractionsSharingHeroImage: dupImgs.reduce((s, [, v]) => s + v.length, 0),
    sampleDupImages: dupImgs.slice(0, 5),
    duplicateNameGroups: dupNames,
    duplicateCoordGroups: dupCoords.slice(0, 10),
    hiddenGems: attractions.filter(a => a.isHiddenGem).length,
    storedReviewsCountSum: reviewsCountSum,
    actualReviewRows: realReviews,
    hotels: hotels.length,
    hotelsSharingImage: Object.values(hotelImgs).filter(v => v.length > 1).reduce((s, v) => s + v.length, 0),
    sampleHotels: hotels.slice(0, 6).map(h => `${h.name} ₹${h.startingPriceInr}`),
    users: await prisma.user.findMany({ select: { email: true, role: true } }),
    cities: await prisma.city.count(),
  };
  console.log(JSON.stringify(out, null, 2));
  await prisma.$disconnect();
})();
