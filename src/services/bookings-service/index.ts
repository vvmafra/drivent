import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/bookings-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import ticketsRepository from '../../repositories/tickets-repository';

async function getBookings(userId: number) {
  const bookings = await bookingRepository.findBookingObj(userId);

  if (!bookings) throw notFoundError();
  return bookings;
}

async function postBooking(userId:number, roomId: number) {
  const enrollment = await enrollmentRepository.findUser(userId)
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
  const booking = await bookingRepository.findBookingByuserId(userId)
  const room = await bookingRepository.findRoom(booking.roomId)

  if (ticket.TicketType.isRemote === true) throw {message: "Ticket is remote", type: "RemoteError"}
  if (ticket.TicketType.includesHotel === false) throw {message: "Ticket doesn't include hotel", type: "HotelError"}
  if (ticket.status === "RESERVED") throw {message: "Ticket isn't paid yet", type: "PaymentError"}
  if (room.capacity === 0) throw {message: "Room is already full", type: "RoomError"}
  if (!room) throw {message: "This room doesn't exist", type: "NoRoomError"}

  const newBooking = await bookingRepository.addBooking(userId, roomId);

  return newBooking;
}

async function putBooking(userId:number, roomId: number, bookingId: number) {
  const booking = await bookingRepository.findBookingByuserId(userId)
  const newRoom = await bookingRepository.findRoom(roomId)

  if (!booking) throw {message: "This user doesn't have a booking to chage", type:"BookingError"}
  if (newRoom.capacity === 0) throw {message: "Room is already full", type: "RoomError"}
  if (!newRoom) throw {message: "This room doesn't exist", type: "NoRoomError"}

  const newBooking = await bookingRepository.putBooking(roomId, bookingId)

  return newBooking
}


const bookingService = 
{ getBookings, 
  postBooking, 
  putBooking };

export default bookingService;