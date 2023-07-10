import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

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
    console.log(userId)
    console.log(ticketTypeId)
    const newTicket = await prisma.ticket.create({
      data: {
        ticketTypeId,
        enrollmentId: userId,
        status: "RESERVED"
      }
    })
    console.log(newTicket)
    return newTicket
}

const ticketsRepository = {
    getTicketTypes,
    getTicketsUser,
    postTicket
  };
  
  export default ticketsRepository;