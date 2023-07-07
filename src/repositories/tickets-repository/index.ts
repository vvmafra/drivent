import { Prisma, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import ticketService from '../../services/tickets-service';

async function getTicketTypes() {
    const ticketsTypes = await prisma.ticketType.findMany()
    return ticketsTypes
}

type Tickets = Omit<Ticket, 'Payment'> & {
    TicketType: TicketType
  };

async function getTicketsUser(userId:number): Promise<Tickets> {
    const ticketsUser = await prisma.ticket.findFirst({
        where: {
            Enrollment: {
                userId
            }
        },
          select: {
            id: true,
            status: true,
            ticketTypeId: true,
            enrollmentId: true,
            createdAt: true,
            updatedAt: true,
            TicketType: {
              select: {
                id: true,
                name: true,
                price: true,
                isRemote: true,
                includesHotel: true,
                createdAt: true,
                updatedAt: true
              },
            }
          }
        });
    return ticketsUser
}


async function postTicket(userId:number, ticketTypeId:number):Promise<Ticket>{
    const newTicket = await prisma.ticket.create({
      data: {
        ticketTypeId,
        enrollmentId: userId,
        status: "RESERVED",
        createdAt: new Date(Date.now()), 
        updatedAt: new Date(Date.now()),
      }
    })

    return newTicket
}

const ticketsRepository = {
    getTicketTypes,
    getTicketsUser,
    postTicket
  };
  
  export default ticketsRepository;