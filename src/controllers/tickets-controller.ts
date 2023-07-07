import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '../services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketTypes(req: Request, res: Response) {
    try {
        const tickets = await ticketService.getTicketTypes();
        res.send(tickets)
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send([]);
      }
}

export async function getTicketsUser(req: AuthenticatedRequest, res: Response){

    const userId = req.userId

    try {
        const ticketsUser = await ticketService.getTicketsUser(userId)
        res.send(ticketsUser)
    }catch (error) {
        return res.status(httpStatus.NOT_FOUND).send([]);
      }

}