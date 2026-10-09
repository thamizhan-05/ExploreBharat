import { prisma } from '@bharatyatra/database';

export type EntityVerificationStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED' | 'STALE';

export interface VerificationEvaluation {
  status: EntityVerificationStatus;
  isStale: boolean;
  daysSinceVerification: number;
  reasons: string[];
  confidenceScore: number;
}

export class VerificationService {
  /**
   * Evaluates attraction provenance, official sources, and data integrity
   */
  public static evaluateAttraction(attraction: {
    name: string;
    sourceType?: string | null;
    sourceName?: string | null;
    sourceUrl?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    heroImageUrl?: string | null;
    images?: Array<{ verificationStatus: string; contentHash?: string | null }>;
    lastVerifiedAt?: Date | null;
  }): VerificationEvaluation {
    const reasons: string[] = [];
    let score = 0;

    // Check 1: Official source URL
    const hasSource = Boolean(
      attraction.sourceUrl &&
      attraction.sourceUrl.startsWith('http') &&
      attraction.sourceType &&
      attraction.sourceType !== 'UNKNOWN'
    );
    if (hasSource) {
      score += 35;
    } else {
      reasons.push('Missing verifiable government or official organization source URL.');
    }

    // Check 2: Valid coordinates within India bounds
    const lat = attraction.latitude || 0;
    const lng = attraction.longitude || 0;
    const validCoords = lat >= 6.0 && lat <= 38.0 && lng >= 68.0 && lng <= 98.0;
    if (validCoords) {
      score += 25;
    } else {
      reasons.push('GPS coordinates missing or outside territorial boundaries of India.');
    }

    // Check 3: Verified primary image
    const hasVerifiedImage = Boolean(
      attraction.heroImageUrl &&
      (attraction.images?.some(img => img.verificationStatus === 'VERIFIED') || attraction.heroImageUrl.includes('upload.wikimedia.org'))
    );
    if (hasVerifiedImage) {
      score += 25;
    } else {
      reasons.push('Missing authenticated place-specific photograph.');
    }

    // Check 4: Recency (Within 180 days)
    let daysSinceVerification = 999;
    let isStale = false;
    if (attraction.lastVerifiedAt) {
      daysSinceVerification = Math.floor(
        (Date.now() - new Date(attraction.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceVerification <= 180) {
        score += 15;
      } else {
        isStale = true;
        reasons.push(`Record has not been audited for ${daysSinceVerification} days (exceeds 180-day threshold).`);
      }
    } else {
      isStale = true;
      reasons.push('Record has never undergone formal editorial audit.');
    }

    // Determine Status
    let status: EntityVerificationStatus = 'UNVERIFIED';
    if (isStale && score >= 70) {
      status = 'STALE';
    } else if (score >= 85) {
      status = 'VERIFIED';
    } else if (score >= 45) {
      status = 'PARTIALLY_VERIFIED';
    } else {
      status = 'UNVERIFIED';
    }

    return {
      status,
      isStale,
      daysSinceVerification,
      reasons,
      confidenceScore: Math.min(100, score)
    };
  }

  /**
   * Evaluates hotel property authenticity and price transparency
   */
  public static evaluateHotel(hotel: {
    name: string;
    latitude?: number | null;
    longitude?: number | null;
    phone?: string | null;
    website?: string | null;
    heroImageUrl?: string | null;
    startingPriceInr?: number | null;
    priceType?: string | null;
    lastVerifiedAt?: Date | null;
  }): VerificationEvaluation {
    const reasons: string[] = [];
    let score = 0;

    const hasContact = Boolean(hotel.phone || hotel.website);
    if (hasContact) score += 30;
    else reasons.push('Missing official direct phone or property website.');

    const lat = hotel.latitude || 0;
    const lng = hotel.longitude || 0;
    if (lat >= 6.0 && lat <= 38.0 && lng >= 68.0 && lng <= 98.0) score += 30;
    else reasons.push('Coordinates unverified.');

    if (hotel.heroImageUrl) score += 20;
    else reasons.push('Missing authentic property exterior photo.');

    if (hotel.startingPriceInr && hotel.priceType !== 'UNAVAILABLE') score += 20;
    else reasons.push('Pricing status is unavailable or unconfirmed.');

    let daysSinceVerification = 999;
    let isStale = false;
    if (hotel.lastVerifiedAt) {
      daysSinceVerification = Math.floor(
        (Date.now() - new Date(hotel.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceVerification > 180) {
        isStale = true;
      }
    }

    let status: EntityVerificationStatus = 'UNVERIFIED';
    if (isStale && score >= 60) status = 'STALE';
    else if (score >= 80) status = 'VERIFIED';
    else if (score >= 50) status = 'PARTIALLY_VERIFIED';
    else status = 'UNVERIFIED';

    return {
      status,
      isStale,
      daysSinceVerification,
      reasons,
      confidenceScore: score
    };
  }

  /**
   * Reusable administrative action audit logger
   */
  public static async logAuditAction(params: {
    actorUserId?: string;
    actorEmail?: string;
    action: 'VERIFY' | 'REJECT' | 'EDIT' | 'MERGE' | 'DISABLE' | 'RESTORE' | 'CREATE' | 'DELETE';
    entityType: 'ATTRACTION' | 'HOTEL' | 'IMAGE' | 'USER' | 'BOOKING' | 'SUGGESTION' | 'TICKET';
    entityId: string;
    details?: string;
    changes?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await prisma.auditLog.create({
        data: {
          actorUserId: params.actorUserId || null,
          actorEmail: params.actorEmail || null,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          details: params.details || null,
          changes: params.changes ? JSON.stringify(params.changes) : '{}',
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null
        }
      });
    } catch (err: any) {
      console.error('AuditLog logging error:', err.message);
      return null;
    }
  }
}
