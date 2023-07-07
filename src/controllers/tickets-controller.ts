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
        res.status(httpStatus.CREATED).send(ticketsUser)
    }catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send([]);
      }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId
    const ticketTypeId = req.body
    try {
        await ticketService.postTicket(userId, ticketTypeId)
        const newTicket = ticketService.getTicketsUser(userId)
        res.status(201).send(newTicket)
    } catch (error) {
        if (error.name === 'NotFoundError' || error.name === 'RequestError') {
          return res.sendStatus(httpStatus.NO_CONTENT);
        }
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
      }
}