import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

async function findHotels(): Promise<Hotel[]> {
    const hotels = prisma.hotel.findMany(); 
  return hotels
}

async function findHotelId(hotelId:number) {


  const hotel = await prisma.hotel.findUnique({
    where: {
      id: hotelId
    }
  })

  const Rooms = await prisma.room.findMany({
    where: {
      hotelId
    }
  })


  return {Rooms, hotel}
}

export default {
  findHotels,
  findHotelId
};