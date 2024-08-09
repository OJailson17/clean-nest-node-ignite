import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

const prisma = new PrismaClient();

const generateUniqueDatabaseURL = (schemaId: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not provided');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
};

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseUrl;

  execSync('yarn prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
