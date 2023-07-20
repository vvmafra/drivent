import { prisma } from '@/config';
import faker from '@faker-js/faker';

export async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
          userId,
          roomId
        }
      })
}

export async function createBookingRandomRoomId(userId: number) {
  return prisma.booking.create({
      data: {
        userId,
        roomId: faker.datatype.number({min:1000000000})
      }
    })
}