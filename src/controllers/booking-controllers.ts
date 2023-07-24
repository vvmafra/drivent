import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '../services/booking-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const userId:number = req.userId
  try {
    const bookings = await bookingService.getBookings(userId);
    return res.status(httpStatus.OK).send(bookings);
  } catch (e) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postBooking(req:AuthenticatedRequest, res: Response) {
  const {userId} = req
  const roomId:number = parseInt(req.body.roomId)
  try {
    const booking = await bookingService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send({bookingId: booking.id});
  } catch (e) {
    if (e.name === 'RemoteError') {
      return res.status(httpStatus.FORBIDDEN).send(e.message)
    } 
    
    else if (e.name === 'HotelError' || e.name === 'PaymentError' || e.name === 'RoomError') {
      return res.status(httpStatus.FORBIDDEN).send(e.message)
    }
    else if (e.name === 'NoRoomError') return res.status(httpStatus.NOT_FOUND).send(e.message)

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function changeRoom(req:AuthenticatedRequest, res: Response) {
  const userId:number = req.userId
  const roomId:number = parseInt(req.body.roomId)
  const bookingId:number = parseInt(req.params.bookingId)

  try {
    const booking = await bookingService.putBooking(userId, roomId, bookingId);
    return res.status(httpStatus.OK).send({bookingId: booking.id});
  } catch (e) {
    if (e.name === 'RoomError' || e.name ==='BookingError') {
      return res.status(httpStatus.FORBIDDEN).send(e.message)
    }
    else if (e.name === 'NoRoomError') return res.status(httpStatus.NOT_FOUND).send(e.message)

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
}