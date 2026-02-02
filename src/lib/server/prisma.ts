import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

prisma = new PrismaClient({
	log: ['query', 'info', 'warn', 'error']
});

export default prisma;
