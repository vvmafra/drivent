import ticketsRepository from "@/repositories/tickets-repository"

async function getTicketTypes(){
    const tickets = await ticketsRepository.getTicketTypes()
    return tickets
}

async function getTicketsUser(userId:number){
    const ticketUser = await ticketsRepository.getTicketsUser(userId)
    return ticketUser
}

const ticketService = {
    getTicketTypes,
    getTicketsUser
}

export default ticketService