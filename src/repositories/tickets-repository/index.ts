import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketTypes() {
    const ticketsTypes = await prisma.ticketType.findMany()
    return ticketsTypes
}

const ticketsRepository = {
    getTicketTypes,
  };
  
  export default ticketsRepository;