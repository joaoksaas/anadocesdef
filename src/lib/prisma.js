import { PrismaClient } from '@prisma/client'

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma // Setup para caso exista NODE_ENV
globalForPrisma.prisma = prisma

export default prisma