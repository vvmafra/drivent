import { prisma } from '@/config';
import { BodyPayment } from '../../protocols';

async function getPayments(userId:number, ticketId:number) {
    const payments = await prisma.payment.findMany({
        where: {
            ticketId
        }
    })
    return payments
}

async function newPayment(paymentBody: BodyPayment, userId: number){
    const ticket = await prisma.ticket.findUnique({
        where: {
            id: paymentBody.ticketId
        },
        select: {
            TicketType: {
                select: {
                    price: true
                }
            },
            Enrollment: {
                select: {
                    userId: true
                }
            }
        }
    })

    const payment = await prisma.payment.create({
        data: {
            value: ticket.TicketType.price,
            ticketId: paymentBody.ticketId,
            cardIssuer: paymentBody.cardData.issuer,
            cardLastDigits: `${paymentBody.cardData.number}`.slice(-4)
        }
    })

    return {ticket, payment}
}

async function updatePaymentStatus(ticketId: number){
    const updateStatus = await prisma.ticket.update({
        data: {
            status: 'PAID'
        }, where: {
            id: ticketId
        }
    })
    return updateStatus
}

const paymentsRepository = {
    getPayments,
    newPayment,
    updatePaymentStatus
  };
  
  export default paymentsRepository;