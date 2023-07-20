import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { changeRoom, getBookings, postBooking } from '../controllers/bookings-controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookings)
  .post('/', postBooking)
  .put('/:bookingId',changeRoom)

export { bookingRouter };