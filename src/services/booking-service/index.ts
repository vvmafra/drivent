import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/bookings-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import ticketsRepository from '../../repositories/tickets-repository';
import { genericError } from '../../errors/generic-error';
import hotelsRepository from '../../repositories/hotels-repository';

async function getBookings(userId: number) {
  const bookings = await bookingRepository.findBookingObj(userId);

  if (!bookings) throw notFoundError();
  return bookings;
}

async function postBooking(userId:number, roomId: number) {
  const enrollment = await enrollmentRepository.findUser(userId)
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
 
  if (ticket.TicketType.isRemote === true) throw genericError('RemoteError', 'Ticket is remote')

  if (ticket.TicketType.includesHotel === false) throw genericError('HotelError', 'Ticket doesnt include hotel')

  if (ticket.status === "RESERVED") throw genericError('PaymentError', 'Ticket isnt paid yet')
  
  const room = await hotelsRepository.findRoom(roomId)

  if (!room) throw genericError('NoRoomError', 'This room doesnt exist')

  if (room.capacity <= room.Booking.length) throw genericError('RoomError', 'Room is already full')

  const newBooking = await bookingRepository.addBooking(userId, roomId);

  return newBooking;
}

async function putBooking(userId:number, roomId: number, bookingId: number) {
  const booking = await bookingRepository.findBookingObj(userId)

  if (!booking) throw genericError('BookingError', 'This user doesnt have a booking to change')
    
  const newRoom = await hotelsRepository.findRoom(roomId)

  if (!newRoom) throw genericError('NoRoomError', 'This room doesnt exist')

  if (newRoom.capacity <= newRoom.Booking.length) throw genericError('RoomError', 'Room is already full')
  
  const newBooking = await bookingRepository.putBooking(roomId, bookingId)

  return newBooking
}


const bookingService = 
{ getBookings, 
  postBooking, 
  putBooking };

export default bookingService;