import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '../services/bookings-service';

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
  const userId:number = req.userId
  const roomId:number = req.body
  try {
    const booking = await bookingService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send(booking.id);
  } catch (e) {
    if (e.type === "RemoteError" || e.type === "HotelError" || e.type === "PaymentError") {
      return res.status(httpStatus.FORBIDDEN).send(e.message)
    }
    else if (e.type === "NoRoomError") return res.status(httpStatus.NOT_FOUND).send(e.message)

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}