import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { changeRoom, getBookings, postBooking } from '../controllers/booking-controllers';
import { schemaBooking } from '../schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookings)
  .post('/', validateBody(schemaBooking),postBooking)
  .put('/:bookingId',validateBody(schemaBooking), changeRoom)

export { bookingRouter };