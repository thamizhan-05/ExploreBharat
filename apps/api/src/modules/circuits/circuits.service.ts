import { prisma, parseJsonArray } from '@bharatyatra/database';
import { AppError } from '../../middleware/error.middleware';

export class CircuitsService {
  async getAllCircuits() {
    const circuits = await prisma.tourismCircuit.findMany();
    return circuits.map(this.formatCircuit);
  }

  async getCircuitBySlug(slug: string) {
    const circuit = await prisma.tourismCircuit.findFirst({
      where: {
        OR: [{ id: slug }, { slug }]
      }
    });

    if (!circuit) throw new AppError('Tourism circuit not found.', 404);

    const destinationNames = parseJsonArray<string>(circuit.destinations);
    const relatedCities = await prisma.city.findMany({
      where: {
        name: { in: destinationNames }
      },
      include: {
        state: true,
        attractions: { take: 3 }
      }
    });

    return {
      ...this.formatCircuit(circuit),
      cityDetails: relatedCities
    };
  }

  private formatCircuit(c: any) {
    return {
      ...c,
      destinations: parseJsonArray<string>(c.destinations),
      highlights: parseJsonArray<string>(c.highlights)
    };
  }
}
