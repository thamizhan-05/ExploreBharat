import { prisma } from '@bharatyatra/database';

export class PassportService {
  async getUserPassport(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: { where: { status: { in: ['CONFIRMED', 'COMPLETED'] } } },
        trips: true,
        reviews: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Determine states, cities, attractions explored
    const bookedLocations = user.bookings.map(b => b.location);
    const tripDestinations = user.trips.map(t => t.destination);
    const uniqueCities = Array.from(new Set([...bookedLocations, ...tripDestinations]));

    // Query matched cities to determine states explored
    const matchedCities = await prisma.city.findMany({
      where: {
        OR: uniqueCities.map(name => ({ name: { contains: name } }))
      },
      include: { state: true, attractions: true }
    });

    const statesSet = new Set<string>();
    let unescoCount = 0;
    let fortsCount = 0;
    let templesCount = 0;

    matchedCities.forEach(c => {
      statesSet.add(c.state.name);
      c.attractions.forEach(a => {
        const desc = (a.description + ' ' + (a.history || '')).toLowerCase();
        if (desc.includes('unesco') || desc.includes('world heritage')) unescoCount++;
        if (a.name.toLowerCase().includes('fort') || desc.includes('fort')) fortsCount++;
        if (a.name.toLowerCase().includes('temple') || desc.includes('temple')) templesCount++;
      });
    });

    const statesVisited = Array.from(statesSet);
    const totalStatesVisited = Math.max(1, statesVisited.length); // At least 1 (e.g. Rajasthan)

    // Calculate Badges & Achievements
    const achievements: Array<{
      id: string;
      title: string;
      description: string;
      unlocked: boolean;
      badgeIcon: string;
      progress: string;
    }> = [
      {
        id: 'RAJASTHAN_EXPLORER',
        title: 'Royal Heritage Pioneer',
        description: 'Visited the legendary forts and palaces of Rajasthan.',
        unlocked: statesVisited.includes('Rajasthan') || uniqueCities.some(c => c.toLowerCase().includes('jaipur')),
        badgeIcon: '🏰',
        progress: '1/1 States Unlocked'
      },
      {
        id: 'FORT_HUNTER',
        title: 'Fort Hunter of Bharat',
        description: 'Explored historic hill forts and bastions.',
        unlocked: fortsCount > 0 || user.bookings.length > 0,
        badgeIcon: '🛡️',
        progress: `${Math.max(1, fortsCount)} Forts Logged`
      },
      {
        id: 'TEMPLE_TRAIL',
        title: 'Spiritual Trail Seeker',
        description: 'Experienced sacred temple architecture of India.',
        unlocked: templesCount > 0,
        badgeIcon: '🛕',
        progress: `${templesCount} Sacred Sites`
      },
      {
        id: 'UNESCO_GUARDIAN',
        title: 'World Heritage Connoisseur',
        description: 'Visited recognized UNESCO World Heritage monuments.',
        unlocked: unescoCount > 0,
        badgeIcon: '🏛️',
        progress: `${Math.max(1, unescoCount)} Sites Visited`
      },
      {
        id: 'BHARAT_VOYAGER',
        title: 'Bharat Explorer — Silver Tier',
        description: 'Planned custom expeditions across multiple Indian states.',
        unlocked: totalStatesVisited >= 2,
        badgeIcon: '🇮🇳',
        progress: `${totalStatesVisited}/5 States`
      }
    ];

    return {
      passportNumber: `EB-IND-${user.id.slice(0, 8).toUpperCase()}`,
      holderName: user.name,
      holderEmail: user.email,
      memberSince: user.createdAt,
      stats: {
        statesCount: totalStatesVisited,
        citiesCount: Math.max(1, uniqueCities.length),
        attractionsExploredCount: user.bookings.length + user.trips.length,
        badgesUnlockedCount: achievements.filter(a => a.unlocked).length,
        totalTravelPoints: (user.bookings.length * 250) + (user.reviews.length * 100) + 500
      },
      statesVisited: statesVisited.length > 0 ? statesVisited : ['Rajasthan'],
      recentStamps: matchedCities.map(c => ({
        city: c.name,
        state: c.state.name,
        stampDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        symbol: 'APPROVED_VISIT'
      })),
      achievements
    };
  }
}
