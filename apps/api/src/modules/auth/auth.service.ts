import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, parseJsonArray } from '@bharatyatra/database';
import { env } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() }
    });
    if (existing) {
      throw new AppError('An account with this email already exists.', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash,
        name: data.name.trim(),
        phone: data.phone?.trim() || null,
        role: data.role || 'USER',
        interests: JSON.stringify(['HERITAGE', 'NATURE'])
      }
    });

    const tokens = this.generateTokens(user.id, user.email, user.role);
    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  async login(email: string, pass: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);
    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, updates: {
    name?: string;
    phone?: string;
    travelStyle?: string;
    budgetPreference?: string;
    preferredLanguage?: string;
    interests?: string[];
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
        ...(updates.travelStyle ? { travelStyle: updates.travelStyle } : {}),
        ...(updates.budgetPreference ? { budgetPreference: updates.budgetPreference } : {}),
        ...(updates.preferredLanguage ? { preferredLanguage: updates.preferredLanguage } : {}),
        ...(updates.interests ? { interests: JSON.stringify(updates.interests) } : {})
      }
    });
    return this.sanitizeUser(user);
  }

  generateTokens(userId: string, email: string, role: string) {
    const payload = { userId, email, role };
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  sanitizeUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      preferredLanguage: user.preferredLanguage,
      travelStyle: user.travelStyle,
      budgetPreference: user.budgetPreference,
      interests: parseJsonArray<string>(user.interests),
      createdAt: user.createdAt
    };
  }
}
