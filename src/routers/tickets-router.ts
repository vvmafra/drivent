import { Router } from 'express';
import { getTicketTypes, getTicketsUser, postTicket } from '@/controllers/tickets-controller';
import { authenticateToken } from '../middlewares';

const ticketsRouter = Router();

ticketsRouter.use(authenticateToken)
ticketsRouter.get('/types',getTicketTypes);
ticketsRouter.get('/', getTicketsUser)
ticketsRouter.post('/', postTicket)

export { ticketsRouter };