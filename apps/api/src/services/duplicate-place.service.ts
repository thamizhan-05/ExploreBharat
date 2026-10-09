import { prisma } from '@bharatyatra/database';

export interface DuplicateMatchResult {
  existingAttractionId: string;
  existingName: string;
  cityName: string;
  confidenceScore: number; // 0 - 100
  matchReason: 'EXACT_NAME' | 'NORMALIZED_NAME' | 'PROXIMITY_AND_FUZZY' | 'SLUG_MATCH';
  distanceKm?: number;
  stringSimilarity: number;
}

export class DuplicatePlaceService {
  /**
   * Normalizes a monument or place name by removing honorifics, common religious terms, and punctuation.
   */
  public static normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/^(shree|sri|arulmigu|the|lord|ancient)\s+/i, '')
      .replace(/\s+(temple|mandir|kovil|mahal|palace|fort|killa|monument|caves|sanctuary|lake|falls)$/i, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculates Levenshtein distance between two strings
   */
  public static levenshteinDistance(a: string, b: string): number {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0) return bn;
    if (bn === 0) return an;

    const matrix: number[][] = [];
    for (let i = 0; i <= bn; ++i) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= an; ++j) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= bn; ++i) {
      for (let j = 1; j <= an; ++j) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[bn][an];
  }

  /**
   * String similarity between 0.0 and 1.0
   */
  public static stringSimilarity(a: string, b: string): number {
    const s1 = a.toLowerCase().trim();
    const s2 = b.toLowerCase().trim();
    if (s1 === s2) return 1.0;
    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 1.0;
    const dist = DuplicatePlaceService.levenshteinDistance(s1, s2);
    return Math.max(0, 1 - dist / maxLen);
  }

  /**
   * Great circle distance between two points in km (Haversine formula)
   */
  public static haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Finds candidate duplicate attractions in the database
   */
  public async findDuplicateCandidates(candidate: {
    name: string;
    cityName?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<DuplicateMatchResult[]> {
    const matches: DuplicateMatchResult[] = [];
    const normalizedInput = DuplicatePlaceService.normalizeName(candidate.name);

    const existingAttractions = await prisma.attraction.findMany({
      include: { city: true }
    });

    for (const place of existingAttractions) {
      const normalizedPlaceName = DuplicatePlaceService.normalizeName(place.name);

      // Check 1: Exact Name Match
      if (place.name.toLowerCase().trim() === candidate.name.toLowerCase().trim()) {
        matches.push({
          existingAttractionId: place.id,
          existingName: place.name,
          cityName: place.city.name,
          confidenceScore: 100,
          matchReason: 'EXACT_NAME',
          stringSimilarity: 1.0
        });
        continue;
      }

      // Check 2: Normalized Name Match
      if (normalizedInput === normalizedPlaceName && normalizedInput.length > 2) {
        matches.push({
          existingAttractionId: place.id,
          existingName: place.name,
          cityName: place.city.name,
          confidenceScore: 92,
          matchReason: 'NORMALIZED_NAME',
          stringSimilarity: DuplicatePlaceService.stringSimilarity(candidate.name, place.name)
        });
        continue;
      }

      // Check 3: City Substring Inclusion or High String Similarity
      const isSameCity = candidate.cityName && (
        place.city.name.toLowerCase().includes(candidate.cityName.toLowerCase()) ||
        candidate.cityName.toLowerCase().includes(place.city.name.toLowerCase())
      );
      const hasSubstringOverlap = (normalizedPlaceName.includes(normalizedInput) || normalizedInput.includes(normalizedPlaceName)) && normalizedInput.length >= 4;
      const sim = DuplicatePlaceService.stringSimilarity(candidate.name, place.name);
      const normSim = DuplicatePlaceService.stringSimilarity(normalizedInput, normalizedPlaceName);
      const bestSim = Math.max(sim, normSim);

      if ((isSameCity && hasSubstringOverlap) || (isSameCity && bestSim >= 0.6) || (!isSameCity && hasSubstringOverlap && bestSim >= 0.7)) {
        const confidence = Math.round(isSameCity ? (hasSubstringOverlap ? 88 : bestSim * 85) : bestSim * 75);
        matches.push({
          existingAttractionId: place.id,
          existingName: place.name,
          cityName: place.city.name,
          confidenceScore: Math.min(95, confidence),
          matchReason: 'PROXIMITY_AND_FUZZY',
          stringSimilarity: Math.round(bestSim * 100) / 100
        });
        continue;
      }

      // Check 4: Geographic proximity + Fuzzy Name Match
      if (
        candidate.latitude &&
        candidate.longitude &&
        place.latitude &&
        place.longitude
      ) {
        const distKm = DuplicatePlaceService.haversineDistance(
          candidate.latitude,
          candidate.longitude,
          place.latitude,
          place.longitude
        );

        const sim = DuplicatePlaceService.stringSimilarity(candidate.name, place.name);
        const normSim = DuplicatePlaceService.stringSimilarity(normalizedInput, normalizedPlaceName);
        const bestSim = Math.max(sim, normSim);

        // Within 1.5 km and substantial name overlap
        if (distKm <= 1.5 && bestSim >= 0.55) {
          const confidence = Math.round(
            Math.min(95, bestSim * 60 + Math.max(0, 1.5 - distKm) * 25)
          );

          matches.push({
            existingAttractionId: place.id,
            existingName: place.name,
            cityName: place.city.name,
            confidenceScore: confidence,
            matchReason: 'PROXIMITY_AND_FUZZY',
            distanceKm: Math.round(distKm * 100) / 100,
            stringSimilarity: Math.round(bestSim * 100) / 100
          });
        }
      }
    }

    return matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }
}
