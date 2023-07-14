import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';
import { number } from 'joi';

export async function createHotel() {
    return prisma.hotel.create({
        data: {
          name: faker.name.firstName(),
          image: faker.image.image()
        },
      });
}