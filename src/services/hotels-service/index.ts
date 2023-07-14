import hotelsRepository from "@/repositories/hotels-repository"
import { notFoundError, requestError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import httpStatus from "http-status"

async function getHotels(userId: number){
    const hotels = await hotelsRepository.findHotels()

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

    console.log(hotels.length)

    if (!enrollment) {
        console.log('enrollment error')
        throw notFoundError()
    }

    if (!ticket) {
        console.log('ticket error')
        throw notFoundError()
    }

    if (hotels.length === 0) {
        console.log('hotel error')
        throw notFoundError()
    }
   

    if (ticket.status === "RESERVED") {
        console.log("Need to be PAID")
        throw requestError(httpStatus.PAYMENT_REQUIRED, "PaymentRequired")
    }

    if (ticket.TicketType.isRemote === true) {
        console.log("Need to be presencial")
        throw requestError(httpStatus.PAYMENT_REQUIRED, "PaymentRequired")
    }

    if (ticket.TicketType.includesHotel === false) {
        console.log("Need to include Hotel")
        throw requestError(httpStatus.PAYMENT_REQUIRED, "PaymentRequired")
    }
    
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
