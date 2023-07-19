import { prisma } from '@/config';

async function findBookings(userId: number){
  return prisma.booking.findFirst({
    where: {
        userId
    }
  });
}

export default {
    findBookings
  };
