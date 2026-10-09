export * from '@prisma/client';
export { prisma, default as db } from './client';

export function parseJsonArray<T = string>(raw: string | null | undefined, defaultValue: T[] = []): T[] {
  if (!raw) return defaultValue;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function parseJsonObject<T = Record<string, any>>(raw: string | null | undefined, defaultValue: T = {} as T): T {
  if (!raw) return defaultValue;
  try {
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}
