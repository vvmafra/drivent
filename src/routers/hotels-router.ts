import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelId, getHotels } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter
.all('/*', authenticateToken)
.get('/', getHotels)
.get('/:hotelId', getHotelId)

export { hotelsRouter };
