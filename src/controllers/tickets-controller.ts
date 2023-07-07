import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '../services/tickets-service';

export async function getTicketTypes(req: Request, res: Response) {
    try {
        const tickets = await ticketService.getTicketTypes();
        res.send(tickets)
    } catch (error) {
        console.log("no")
        return res.status(httpStatus.NOT_FOUND).send([]);
      }



}