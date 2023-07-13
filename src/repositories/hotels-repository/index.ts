import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

async function findHotels(): Promise<Hotel[]> {
    const hotels = prisma.hotel.findMany(); 
  return hotels
}

async function findHotelId(hotelId:number) {
  const hotel = prisma.hotel.findUnique({
    where: {
      id: hotelId
    }
  })
  return hotel
}

export default {
  findHotels,
  findHotelId
};