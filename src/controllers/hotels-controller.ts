import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsServices from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const userId:number = req.userId
    
  try {
    const hotels = await hotelsServices.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    else if (error.statusText === 'PaymentRequired') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error)
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
  const userId:number = req.userId
  const hotelId: number = Number(req.params.hotelId);
  
  try {
    const hotel = await hotelsServices.getHotelId(userId, hotelId);
    console.log(hotel)
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    else if (error.statusText === 'PaymentRequired') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error)
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}