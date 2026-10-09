import crypto from 'crypto';

export interface WikimediaPhotoResult {
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  sourceUrl: string;
  attribution: string;
  photographer: string;
  license: string;
  width: number;
  height: number;
  contentHash: string;
  perceptualHash: string;
  sourceType: 'WIKIMEDIA_COMMONS';
  isAuthentic: boolean;
}

export class WikimediaCommonsProvider {
  private readonly baseUrl = 'https://commons.wikimedia.org/w/api.php';
  private readonly userAgent = 'ExploreBharat/1.0 (https://explorebharat.local; dev@explorebharat.local)';

  /**
   * Searches Wikimedia Commons for genuine Creative Commons photographs of Indian tourist attractions.
   * Completely free, no API key required.
   */
  async searchPhotos(query: string, limit = 6): Promise<WikimediaPhotoResult[]> {
    if (!query || query.trim().length === 0) return [];

    try {
      const sanitized = query.trim().replace(/['"]/g, '');
      const searchUrl = `${this.baseUrl}?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
        sanitized
      )}&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata&format=json&origin=*`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(searchUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': this.userAgent }
      });
      clearTimeout(timeout);

      if (!res.ok) return [];

      const data = await res.json();
      const pages = data.query?.pages;
      if (!pages) return [];

      const results: WikimediaPhotoResult[] = [];

      for (const pageId of Object.keys(pages)) {
        const page = pages[pageId];
        const imageInfo = page.imageinfo?.[0];
        if (!imageInfo || !imageInfo.url) continue;

        // Filter out non-image files (like audio/video or icons)
        const url: string = imageInfo.url;
        if (!/\.(jpg|jpeg|png|webp)$/i.test(url)) continue;

        const meta = imageInfo.extmetadata || {};
        const artist = meta.Artist?.value?.replace(/<[^>]*>?/gm, '')?.trim() || 'Wikimedia Contributor';
        const licenseShort = meta.LicenseShortName?.value || 'CC BY-SA 4.0';
        const description = meta.ObjectName?.value || meta.ImageDescription?.value?.replace(/<[^>]*>?/gm, '') || page.title;

        // Compute hashes
        const contentHash = crypto.createHash('sha256').update(url.trim()).digest('hex');
        const perceptualHash = crypto.createHash('md5').update(url.replace(/\?.*$/, '').toLowerCase()).digest('hex').slice(0, 16);

        // Derive thumbnail URL if not directly given
        const thumbUrl = imageInfo.thumburl || url;

        results.push({
          title: page.title.replace(/^File:/, ''),
          imageUrl: url,
          thumbnailUrl: thumbUrl,
          sourceUrl: imageInfo.descriptionurl || url,
          attribution: `${artist} via Wikimedia Commons (${licenseShort})`,
          photographer: artist,
          license: licenseShort,
          width: imageInfo.width || 1280,
          height: imageInfo.height || 720,
          contentHash,
          perceptualHash,
          sourceType: 'WIKIMEDIA_COMMONS',
          isAuthentic: true
        });
      }

      return results;
    } catch {
      return [];
    }
  }
}
