import { Router, Request, Response, NextFunction } from 'express';
import { AttractionsService } from './attractions.service';

const router = Router();
const attractionsService = new AttractionsService();

router.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await attractionsService.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});

router.get('/free', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cityId, cityName, stateCode, stateName, limit } = req.query;
    const result = await attractionsService.getAttractions({
      entryType: 'FREE',
      cityId: cityId as string,
      cityName: cityName as string,
      stateCode: stateCode as string,
      stateName: stateName as string,
      limit: limit ? parseInt(limit as string, 10) : 20
    });
    res.json({ success: true, data: result.items, meta: { total: result.total, page: result.page, totalPages: result.totalPages } });
  } catch (err) {
    next(err);
  }
});

router.get('/hidden-gems', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cityId, cityName, stateCode, stateName, limit } = req.query;
    const result = await attractionsService.getAttractions({
      hiddenGemsOnly: true,
      cityId: cityId as string,
      cityName: cityName as string,
      stateCode: stateCode as string,
      stateName: stateName as string,
      limit: limit ? parseInt(limit as string, 10) : 20
    });
    res.json({ success: true, data: result.items, meta: { total: result.total, page: result.page, totalPages: result.totalPages } });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      categoryId,
      cityId,
      cityName,
      city,
      stateCode,
      stateName,
      state,
      search,
      featured,
      hiddenGems,
      discoveryType,
      verificationStatus,
      district,
      minRating,
      entryType,
      priceRange,
      ticketRequired,
      bookingRequired,
      wheelchair,
      seniorFriendly,
      childFriendly,
      page,
      limit
    } = req.query;

    const result = await attractionsService.getAttractions({
      categoryId: categoryId as string,
      cityId: (cityId || city) as string,
      cityName: cityName as string,
      stateCode: (stateCode || state) as string,
      stateName: stateName as string,
      search: search as string,
      featuredOnly: featured === 'true',
      hiddenGemsOnly: hiddenGems === 'true',
      discoveryType: discoveryType as string,
      verificationStatus: verificationStatus as string,
      district: district as string,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
      entryType: entryType as string,
      priceRange: priceRange as string,
      ticketRequired: ticketRequired !== undefined ? ticketRequired === 'true' : undefined,
      bookingRequired: bookingRequired !== undefined ? bookingRequired === 'true' : undefined,
      wheelchairAccessible: wheelchair !== undefined ? wheelchair === 'true' : undefined,
      seniorFriendly: seniorFriendly !== undefined ? seniorFriendly === 'true' : undefined,
      childFriendly: childFriendly !== undefined ? childFriendly === 'true' : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20
    });

    res.json({ success: true, data: result.items, meta: { total: result.total, page: result.page, totalPages: result.totalPages } });
  } catch (err) {
    next(err);
  }
});

router.get('/nearby', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, radius, entryType } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude (lat) and longitude (lng) are required.' });
    }

    const items = await attractionsService.getNearbyAttractions(
      parseFloat(lat as string),
      parseFloat(lng as string),
      radius ? parseFloat(radius as string) : 100,
      entryType as string
    );

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

router.post('/suggest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const suggestion = await attractionsService.createPlaceSuggestion(req.body);
    res.status(201).json({
      success: true,
      data: suggestion,
      message: 'Place suggestion submitted successfully for editorial review.'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:idOrSlug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attraction = await attractionsService.getAttractionByIdOrSlug(req.params.idOrSlug);
    res.json({ success: true, data: attraction });
  } catch (err) {
    next(err);
  }
});

export const attractionsRouter = router;
