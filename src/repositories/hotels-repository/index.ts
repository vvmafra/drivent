import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

async function findHotels(): Promise<Hotel[]> {
    const hotels = prisma.hotel.findMany(); 
  return hotels
}

export default {
  findHotels,
};