import { notFoundError, unauthorizedError } from "../../errors"
import enrollmentRepository from "../../repositories/enrollment-repository"
import paymentsRepository from "../../repositories/payments-repository"
import ticketsRepository from "../../repositories/tickets-repository"


async function getPayments(userId:number, ticketId:number){

    const ticket = await ticketsRepository.getTicketsUser(ticketId)

    console.log(ticket)
    if (!ticket) throw notFoundError()

    const checkUser = await enrollmentRepository.findUser(ticket.enrollmentId)
    if(userId !== Number(checkUser.userId)) throw unauthorizedError()

    const payments = await paymentsRepository.getPayments(userId, ticketId)
    if (!payments) throw notFoundError()
    const payment = payments[0]

    return payment
}

const paymentService = {
    getPayments,
}

export default paymentService