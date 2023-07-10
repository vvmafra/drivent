import { Router } from 'express';
import { authenticateToken, validateBody } from '../middlewares';
import { schemaTicket } from '@/schemas';
import { getPayments, processPayment } from '@/controllers/payments-controller';


const paymentsRouter = Router();

paymentsRouter.use(authenticateToken)
paymentsRouter.get('/', getPayments);
paymentsRouter.post('/process', processPayment)

export { paymentsRouter };