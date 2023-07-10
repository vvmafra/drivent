import { Router } from 'express';
import { authenticateToken, validateBody } from '../middlewares';
import { schemaTicket } from '@/schemas';
import { getPayments } from '@/controllers/payments-controller';


const paymentsRouter = Router();

paymentsRouter.use(authenticateToken)
paymentsRouter.get('/', getPayments);
paymentsRouter.post('/process')

export { paymentsRouter };