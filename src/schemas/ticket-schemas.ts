import { Ticket } from "@prisma/client";
import Joi from "joi";

export const schemaTicket = Joi.object<Ticket>({
    ticketTypeId: Joi.number().required()
})