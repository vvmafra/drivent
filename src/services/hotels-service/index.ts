import hotelsRepository from "@/repositories/hotels-repository"
import { notFoundError, requestError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import httpStatus from "http-status"
import userRepository from "../../repositories/user-repository"

async function getHotels(userId: number){
    const hotels = await hotelsRepository.findHotels()

    const enrollment = await enrollmentRepository.findUser(userId)
    

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

    if (ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
        throw requestError(httpStatus.PAYMENT_REQUIRED, "PaymentRequired")
    }

    if (!enrollment || !ticket || !hotels || hotels.length === 0) throw notFoundError()

    

    return hotels
}

async function getHotelId(userId: number, hotelId:number) {
    const hotel = (await hotelsRepository.findHotelId(hotelId)).hotel

    const Rooms = (await hotelsRepository.findHotelId(hotelId)).rooms

    const enrollment = await enrollmentRepository.findUser(userId)

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

    if (!enrollment || !ticket || !hotel) throw notFoundError()

    if (ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
        throw requestError(httpStatus.PAYMENT_REQUIRED, "PaymentRequired")
    }
    
    const hotelWithRooms = {
        hotel,
        Rooms
    }

    return hotelWithRooms
}

const hotelsServices = { getHotels, getHotelId }

export default hotelsServices
