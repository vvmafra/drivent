import { prisma } from '@/config';

async function findBookings(userId: number){
  const booking = await prisma.booking.findFirst({
    where: {
        userId
    }
  });

  const room =  await prisma.room.findFirst({
    where: {
      id: booking.roomId
    }
  })

  const bookingObj = {
    id: booking.id,
    Room: room

  }
  return bookingObj
}

export default {
    findBookings
  };
