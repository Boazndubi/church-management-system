  import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error']
});

// Handle connection events
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Handle graceful disconnection
process.on('SIGINT', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

process.on('SIGTERM', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

// Export for use in other files
export default prisma;
