import { Router } from 'express';
import { authenticateToken, validateBody } from '../middlewares';
import { getPayments, processPayment } from '@/controllers/payments-controller';


const paymentsRouter = Router();

paymentsRouter.use(authenticateToken)
paymentsRouter.get('/', getPayments);
paymentsRouter.post('/process', processPayment)

export { paymentsRouter };