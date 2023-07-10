import { Response } from 'express';
import httpStatus from 'http-status';
import paymentService from '@/services/payments-service';
import { AuthenticatedRequest } from '@/middlewares';
import { BodyPayment } from '../protocols';

export async function getPayments(req: AuthenticatedRequest, res: Response){

    const ticketId: number = parseFloat(String(req.query.ticketId));
    const userId: number = req.userId

    if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST)

    try {
        const payments = await paymentService.getPayments(userId, ticketId);
        res.status(httpStatus.OK).send(payments)
    } catch (error) {
        if (error.name === 'UnauthorizedError') {
            return res.sendStatus(httpStatus.UNAUTHORIZED)
        }
        else if (error.name === 'NotFoundError'){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        else if (error.name === 'RequestError') {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
      }
}


export async function processPayment(req: AuthenticatedRequest, res: Response){
    const paymentBody = req.body as BodyPayment
    const userId: number = req.userId

    if (!paymentBody.cardData || !paymentBody.ticketId) return res.sendStatus(httpStatus.BAD_REQUEST)

    try {
        const payment = await paymentService.processPayment(paymentBody, userId)
        res.status(httpStatus.OK).send(payment)
    }catch (error) {
        if (error.name === 'UnauthorizedError') {
            return res.sendStatus(httpStatus.UNAUTHORIZED)
        }
        else if (error.name === 'NotFoundError'){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        else if (error.name === 'RequestError') {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
      }
}