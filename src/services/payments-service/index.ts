import { notFoundError, unauthorizedError } from "../../errors"
import { BodyPayment } from "../../protocols"
import enrollmentRepository from "../../repositories/enrollment-repository"
import paymentsRepository from "../../repositories/payments-repository"
import ticketsRepository from "../../repositories/tickets-repository"


async function getPayments(userId:number, ticketId:number){

    const ticket = await ticketsRepository.getTicketId(ticketId)
    if (!ticket) throw notFoundError()

    const checkUser = await enrollmentRepository.findUserEnrollment(ticket.enrollmentId)
    if(userId !== Number(checkUser.userId)) throw unauthorizedError()

    const payments = await paymentsRepository.getPayments(userId, ticketId)
    if (!payments) throw notFoundError()

    return payments[0]
}

async function processPayment(paymentBody: BodyPayment, userId: number){

    const ticket = await ticketsRepository.getTicketId(paymentBody.ticketId)
    if (!ticket) throw notFoundError()

    const checkUser = await enrollmentRepository.findUserEnrollment(ticket.enrollmentId)
    if(userId !== Number(checkUser.userId)) throw unauthorizedError()

    await paymentsRepository.updatePaymentStatus(paymentBody.ticketId)
    const payment = await paymentsRepository.newPayment(paymentBody, userId)

    return payment
}

const paymentService = {
    getPayments,
    processPayment
}

export default paymentService