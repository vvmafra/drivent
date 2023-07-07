import ticketsRepository from "@/repositories/tickets-repository"

async function getTicketTypes(){
    const tickets = await ticketsRepository.getTicketTypes()
    return tickets
}

const ticketService = {
    getTicketTypes
}

export default ticketService