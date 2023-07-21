import { prisma } from '@/config';

async function findBookingObj(userId: number){
  const booking = await prisma.booking.findFirst({
    where: {
        userId
    }
  });

  if (!booking) {
    return null;
  }

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

async function findBookingByuserId(userId: number){
  return await prisma.booking.findFirst({
    where: {
      userId
    }
  })
}

async function addBooking(userId:number, roomId: number){
  return await prisma.booking.create({
    data: {
      userId,
      roomId
    }
  })
}

async function putBooking(roomId:number, bookingId:number) {
  return await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      roomId
    }
  })
}

export default {
    findBookingObj,
    findBookingByuserId,
    addBooking,
    putBooking
  };
