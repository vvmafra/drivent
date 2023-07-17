import hotelsRepository from "@/repositories/hotels-repository"
import { notFoundError, requestError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import httpStatus from "http-status"

async function getHotels(userId: number){

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if (!enrollment) {
        throw notFoundError()
    }

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

    if (!ticket) {
        throw notFoundError()
    }

    if (ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
        throw requestError(httpStatus.PAYMENT_REQUIRED, "PaymentRequired")
    }

    const hotels = await hotelsRepository.findHotels()

    if (hotels.length === 0) {
        throw notFoundError()
    }


    return hotels
}

async function getHotelId(userId: number, hotelId:number) {
    
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if (!enrollment)  throw notFoundError()

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

    if (!ticket) throw notFoundError()

    if (ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
        throw requestError(httpStatus.PAYMENT_REQUIRED, "PaymentRequired")
    }
    
    const hotel = (await hotelsRepository.findHotelId(hotelId)).hotel
    const rooms = (await hotelsRepository.findHotelId(hotelId)).Rooms

    const hotelWithRooms = {...hotel,
    Rooms: rooms}

    if (!hotel) {
        throw notFoundError()
    }

    return hotelWithRooms
}

const hotelsServices = { getHotels, getHotelId }

export default hotelsServices
