import { Router } from 'express';
import { getTicketTypes } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.get('/types',getTicketTypes);

export { ticketsRouter };