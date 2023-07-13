import hotelsRepository from "@/repositories/hotels-repository"
import { notFoundError, requestError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import httpStatus from "http-status"

async function getHotels(userId: number){
    const hotels = await hotelsRepository.findHotels()

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

    if (ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
        throw requestError(httpStatus.PAYMENT_REQUIRED, "PaymentRequired")
    }

    if (!enrollment || !ticket || !hotels || hotels.length === 0) throw notFoundError()


    return hotels
}

async function getHotelId(userId: number, hotelId:number) {
    const hotel = (await hotelsRepository.findHotelId(hotelId)).hotel
    const hotelWithRooms = (await hotelsRepository.findHotelId(hotelId)).hotelWithRooms

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

    if (!enrollment || !ticket || !hotel) throw notFoundError()

    if (ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
        throw requestError(httpStatus.PAYMENT_REQUIRED, "PaymentRequired")
    }
    
    return hotelWithRooms
}

const hotelsServices = { getHotels, getHotelId }

export default hotelsServices
