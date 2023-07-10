import { prisma } from '@/config';

async function getPayments(userId:number, ticketId:number) {
    const payments = await prisma.payment.findMany({
        where: {
            ticketId
        }
    })
    return payments
}

const paymentsRepository = {
    getPayments,
  };
  
  export default paymentsRepository;