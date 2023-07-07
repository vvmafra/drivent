import ticketsRepository from "@/repositories/tickets-repository"
import enrollmentRepository from "../../repositories/enrollment-repository"
import { notFoundError } from "../../errors"
import { requestError } from "../../errors"


async function getTicketTypes(){
    const tickets = await ticketsRepository.getTicketTypes()
    return tickets
}

async function getTicketsUser(userId:number){
    const checkUser = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!checkUser) throw notFoundError()

    const ticketUser = await ticketsRepository.getTicketsUser(userId)
    if(!ticketUser) throw notFoundError()

    return ticketUser
}

async function postTicket(userId:number, ticketTypeId:number){
    const checkUser = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!checkUser) throw notFoundError()
    
    if (!ticketTypeId) throw requestError(400,"Bad request")

    const newTicket = await ticketsRepository.postTicket(userId, ticketTypeId)
    return newTicket
}

const ticketService = {
    getTicketTypes,
    getTicketsUser,
    postTicket
}

export default ticketService