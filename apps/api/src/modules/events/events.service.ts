import { prisma } from '@bharatyatra/database';
import { AppError } from '../../middleware/error.middleware';

export class EventsService {
  async getEvents(params?: {
    cityId?: string;
    cityName?: string;
    stateCode?: string;
    category?: string;
    search?: string;
    featuredOnly?: boolean;
    limit?: number;
  }) {
    const limit = params?.limit || 20;
    const where: any = {};

    if (params?.cityId) where.cityId = params.cityId;
    if (params?.category) where.category = params.category.toUpperCase();
    if (params?.featuredOnly) where.isFeatured = true;

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { description: { contains: params.search } },
        { location: { contains: params.search } }
      ];
    }

    if (params?.cityName) {
      where.city = { name: { contains: params.cityName } };
    }

    if (params?.stateCode) {
      where.city = { state: { code: params.stateCode.toUpperCase() } };
    }

    const events = await prisma.event.findMany({
      where,
      take: limit,
      include: {
        city: {
          include: { state: true }
        }
      },
      orderBy: [{ isFeatured: 'desc' }, { startDate: 'asc' }]
    });

    return events;
  }

  async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        city: {
          include: { state: true }
        }
      }
    });

    if (!event) {
      throw new AppError('Cultural event not found.', 404);
    }

    return event;
  }
}
