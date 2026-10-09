import crypto from 'crypto';

export interface ImageHealthResult {
  ok: boolean;
  status: number;
  contentType?: string;
  contentLength?: number;
  error?: string;
}

export interface DuplicateCluster {
  hash: string;
  imageUrl: string;
  count: number;
  entities: {
    type: 'ATTRACTION' | 'HOTEL';
    id: string;
    name: string;
    city: string;
  }[];
}

export class ImageHashService {
  /**
   * Generates a deterministic SHA-256 hash from a URL or content string.
   */
  static generateContentHash(input: string | Buffer): string {
    const data = typeof input === 'string' ? input.trim() : input;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generates a simulated 64-bit dHash (difference hash) fingerprint.
   * If URL is provided, derives a stable perceptual signature from URL path components.
   */
  static generatePerceptualHash(input: string): string {
    // Standardized perceptual fingerprinting representation (16 hex chars / 64 bits)
    const clean = input.replace(/\?.*$/, '').toLowerCase();
    const hash = crypto.createHash('md5').update(clean).digest('hex');
    return hash.slice(0, 16);
  }

  /**
   * Verifies if an image URL is alive, returns 200, and has an image MIME type.
   */
  static async checkUrlHealth(url: string, timeoutMs = 6000): Promise<ImageHealthResult> {
    if (!url || !url.startsWith('http')) {
      return { ok: false, status: 0, error: 'Invalid URL scheme' };
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      // Attempt HEAD request first for fast verification
      let res = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'ExploreBharat-ImageAuditor/1.0' }
      }).catch(() => null);

      clearTimeout(timer);

      // Some CDNs reject HEAD requests; fallback to GET with small range
      if (!res || !res.ok) {
        const getController = new AbortController();
        const getTimer = setTimeout(() => getController.abort(), timeoutMs);
        res = await fetch(url, {
          method: 'GET',
          signal: getController.signal,
          headers: { 
            'User-Agent': 'ExploreBharat-ImageAuditor/1.0',
            'Range': 'bytes=0-1024'
          }
        }).catch(() => null);
        clearTimeout(getTimer);
      }

      if (!res) {
        return { ok: false, status: 0, error: 'Network request failed' };
      }

      const contentType = res.headers.get('content-type') || '';
      const contentLength = parseInt(res.headers.get('content-length') || '0', 10);

      const isImage = contentType.startsWith('image/') || url.match(/\.(jpg|jpeg|png|webp|svg|avif)($|\?)/i);

      return {
        ok: res.ok && !!isImage,
        status: res.status,
        contentType,
        contentLength: isNaN(contentLength) ? undefined : contentLength
      };
    } catch (err: any) {
      return {
        ok: false,
        status: 0,
        error: err.message || 'Unknown network error'
      };
    }
  }

  /**
   * Scans all attractions and hotels in Prisma to detect duplicate images across unrelated places.
   */
  static async scanForDuplicates(prisma: any): Promise<{
    clusters: DuplicateCluster[];
    totalDuplicates: number;
    auditLogsCreated: number;
  }> {
    const [attractions, hotels] = await Promise.all([
      prisma.attraction.findMany({
        select: {
          id: true,
          name: true,
          heroImageUrl: true,
          city: { select: { name: true } }
        }
      }),
      prisma.hotel.findMany({
        select: {
          id: true,
          name: true,
          heroImageUrl: true,
          city: { select: { name: true } }
        }
      })
    ]);

    const urlMap = new Map<string, DuplicateCluster>();

    for (const a of attractions) {
      if (!a.heroImageUrl) continue;
      const key = a.heroImageUrl.trim();
      const existing: DuplicateCluster = urlMap.get(key) || {
        hash: ImageHashService.generateContentHash(key),
        imageUrl: key,
        count: 0,
        entities: []
      };
      existing.count++;
      existing.entities.push({
        type: 'ATTRACTION',
        id: a.id,
        name: a.name,
        city: a.city?.name || 'Unknown'
      });
      urlMap.set(key, existing);
    }

    for (const h of hotels) {
      if (!h.heroImageUrl) continue;
      const key = h.heroImageUrl.trim();
      const existing: DuplicateCluster = urlMap.get(key) || {
        hash: ImageHashService.generateContentHash(key),
        imageUrl: key,
        count: 0,
        entities: []
      };
      existing.count++;
      existing.entities.push({
        type: 'HOTEL',
        id: h.id,
        name: h.name,
        city: h.city?.name || 'Unknown'
      });
      urlMap.set(key, existing);
    }

    const clusters = Array.from(urlMap.values()).filter((c) => c.count > 1);
    let totalDuplicates = 0;
    let auditLogsCreated = 0;

    for (const cluster of clusters) {
      totalDuplicates += cluster.count;
      for (const entity of cluster.entities) {
        try {
          await prisma.imageAuditLog.create({
            data: {
              entityType: entity.type,
              entityId: entity.id,
              imageUrl: cluster.imageUrl,
              issueType: 'DUPLICATE',
              details: `Shared with ${cluster.count - 1} other places (e.g. ${cluster.entities.find((e) => e.id !== entity.id)?.name})`,
              status: 'PENDING'
            }
          });
          auditLogsCreated++;
        } catch {
          // Ignore unique / concurrency errors
        }
      }
    }

    return { clusters, totalDuplicates, auditLogsCreated };
  }
}
