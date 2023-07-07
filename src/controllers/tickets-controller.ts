import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '../services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketTypes(req: Request, res: Response) {
    try {
        const tickets = await ticketService.getTicketTypes();
        res.status(httpStatus.OK).send(tickets)
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send([]);
      }
}

export async function getTicketsUser(req: AuthenticatedRequest, res: Response){
    const userId = req.userId

    try {
        const ticketsUser = await ticketService.getTicketsUser(userId)
        res.status(httpStatus.OK).send(ticketsUser)
    }catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
          }
          res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId
    const ticketTypeId = req.body
    try {
        await ticketService.postTicket(userId, ticketTypeId)
        const newTicket = ticketService.getTicketsUser(userId)
        res.status(httpStatus.CREATED).send(newTicket)
    } catch (error) {
        if (error.name === 'NotFoundError' || error.name === 'RequestError') {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
      }
}