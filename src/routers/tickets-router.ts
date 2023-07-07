import { Router } from 'express';
import { getTicketTypes, getTicketsUser, postTicket } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '../middlewares';
import { schemaTicket } from '@/schemas';


const ticketsRouter = Router();

ticketsRouter.use(authenticateToken)
ticketsRouter.get('/types',getTicketTypes);
ticketsRouter.get('/', getTicketsUser)
ticketsRouter.post('/',validateBody(schemaTicket) ,postTicket)

export { ticketsRouter };