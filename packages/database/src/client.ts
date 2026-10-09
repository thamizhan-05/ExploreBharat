import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

export const prisma = global.__db || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') {
  global.__db = prisma;
}

export default prisma;
