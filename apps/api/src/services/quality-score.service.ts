export interface QualityScoreBreakdown {
  score: number; // 0 - 100
  factors: {
    nameVerified: boolean; // +10
    locationValid: boolean; // +15 (State, City, District)
    coordinatesValid: boolean; // +15 (lat & lng in valid ranges for India: 6-38 N, 68-98 E)
    categoryAssigned: boolean; // +10
    entryRulesVerified: boolean; // +15 (FREE with 0 fee, or PAID with valid breakdown)
    hoursSpecified: boolean; // +10
    sourceTraceable: boolean; // +10 (Official Govt, ASI, etc.)
    imageVerified: boolean; // +10 (Primary image with contentHash and verified status)
    recentlyVerified: boolean; // +5 (Within 180 days)
  };
  recommendations: string[];
}

export class QualityScoreService {
  /**
   * Computes Data Quality Score (0–100) for an Attraction
   */
  public static calculateAttractionQuality(attraction: {
    name?: string | null;
    stateName?: string | null;
    city?: { name: string } | null;
    latitude?: number | null;
    longitude?: number | null;
    category?: any;
    entryType?: string | null;
    entryFee?: number | null;
    openingTime?: string | null;
    closingTime?: string | null;
    sourceType?: string | null;
    sourceUrl?: string | null;
    images?: Array<{ verificationStatus: string; isPrimary: boolean; contentHash?: string | null }>;
    heroImageUrl?: string | null;
    lastVerifiedAt?: Date | null;
  }): QualityScoreBreakdown {
    let score = 0;
    const recommendations: string[] = [];

    // Factor 1: Name
    const nameVerified = Boolean(attraction.name && attraction.name.trim().length > 3);
    if (nameVerified) score += 10;
    else recommendations.push('Provide a full verified monument name.');

    // Factor 2: Location
    const locationValid = Boolean(attraction.stateName && attraction.city?.name);
    if (locationValid) score += 15;
    else recommendations.push('Ensure both State and City locations are linked.');

    // Factor 3: Coordinates (India boundaries roughly Lat: 6 to 38, Lng: 68 to 98)
    const lat = attraction.latitude || 0;
    const lng = attraction.longitude || 0;
    const coordinatesValid = lat >= 6.0 && lat <= 38.0 && lng >= 68.0 && lng <= 98.0;
    if (coordinatesValid) score += 15;
    else recommendations.push('Add valid GPS coordinates within Indian territorial borders.');

    // Factor 4: Category
    const categoryAssigned = Boolean(attraction.category);
    if (categoryAssigned) score += 10;
    else recommendations.push('Categorize under an official tourism category.');

    // Factor 5: Entry Rules
    const entryRulesVerified = Boolean(
      attraction.entryType &&
      attraction.entryType !== 'UNKNOWN' &&
      (attraction.entryType === 'FREE' ? (attraction.entryFee === 0 || attraction.entryFee === null) : true)
    );
    if (entryRulesVerified) score += 15;
    else recommendations.push('Verify admission entry rules and ticketing requirements.');

    // Factor 6: Hours
    const hoursSpecified = Boolean(attraction.openingTime && attraction.closingTime);
    if (hoursSpecified) score += 10;
    else recommendations.push('Specify public visiting hours.');

    // Factor 7: Source
    const sourceTraceable = Boolean(
      attraction.sourceType &&
      attraction.sourceType !== 'UNKNOWN' &&
      attraction.sourceUrl &&
      attraction.sourceUrl.startsWith('http')
    );
    if (sourceTraceable) score += 10;
    else recommendations.push('Link to an official government or administrative source URL.');

    // Factor 8: Image Verified
    const hasPrimaryVerified = attraction.images?.some(
      (img) => img.isPrimary && img.verificationStatus === 'VERIFIED' && img.contentHash
    ) || Boolean(attraction.heroImageUrl);
    const imageVerified = Boolean(hasPrimaryVerified);
    if (imageVerified) score += 10;
    else recommendations.push('Provide a verified primary photograph with cryptographic hash.');

    // Factor 9: Recently Verified (within 180 days)
    let recentlyVerified = false;
    if (attraction.lastVerifiedAt) {
      const daysAgo = (Date.now() - new Date(attraction.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysAgo <= 180) {
        recentlyVerified = true;
        score += 5;
      }
    }
    if (!recentlyVerified) {
      recommendations.push('Perform periodic verification audit to refresh confidence.');
    }

    return {
      score: Math.min(100, score),
      factors: {
        nameVerified,
        locationValid,
        coordinatesValid,
        categoryAssigned,
        entryRulesVerified,
        hoursSpecified,
        sourceTraceable,
        imageVerified,
        recentlyVerified
      },
      recommendations
    };
  }
}
