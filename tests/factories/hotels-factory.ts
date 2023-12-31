import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
    return prisma.hotel.create({
        data: {
          name: faker.name.firstName(),
          image: faker.image.imageUrl()
        },
      });
}

export async function createRooms(hotelId: number) {
    return prisma.room.create({
      data: {
        name: faker.name.middleName(),
        capacity: faker.datatype.number(),
        hotelId
      }
    })
}

export async function createRoomsWithoutCapacity(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.middleName(),
      capacity: 0,
      hotelId
    }
  })
}