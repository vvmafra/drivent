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