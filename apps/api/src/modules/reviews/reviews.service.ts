import { prisma, parseJsonArray } from '@bharatyatra/database';
import { AppError } from '../../middleware/error.middleware';

export class ReviewsService {
  async getReviewsForTarget(targetType: string, targetId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        targetType,
        targetId,
        status: 'APPROVED'
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reviews.map((r) => ({
      ...r,
      photos: parseJsonArray<string>(r.photos)
    }));
  }

  async submitReview(data: {
    userId: string;
    targetType: string;
    targetId: string;
    rating: number;
    title: string;
    comment: string;
    photos?: string[];
  }) {
    if (data.rating < 1 || data.rating > 5) {
      throw new AppError('Rating must be between 1 and 5 stars.', 400);
    }

    // Check if user has an associated verified booking for verified badge
    const hasBooking = await prisma.booking.findFirst({
      where: {
        userId: data.userId,
        status: 'CONFIRMED'
      }
    });

    const review = await prisma.review.create({
      data: {
        userId: data.userId,
        targetType: data.targetType,
        targetId: data.targetId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        photos: JSON.stringify(data.photos || []),
        isVerifiedBooking: !!hasBooking,
        status: 'APPROVED'
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    return {
      ...review,
      photos: parseJsonArray<string>(review.photos)
    };
  }
}
