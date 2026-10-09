import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();
const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.enum(['USER', 'VENDOR', 'GUIDE']).default('USER')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  travelStyle: z.string().optional(),
  budgetPreference: z.string().optional(),
  preferredLanguage: z.string().optional(),
  interests: z.array(z.string()).optional()
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await authService.register(validated);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Account successfully registered.'
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.login(validated.email, validated.password);
    res.json({
      success: true,
      data: result,
      message: 'Login successful.'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

router.put('/profile', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = updateProfileSchema.parse(req.body);
    const updated = await authService.updateProfile(req.user!.userId, validated);
    res.json({
      success: true,
      data: updated,
      message: 'Profile updated successfully.'
    });
  } catch (err) {
    next(err);
  }
});

export const authRouter = router;
