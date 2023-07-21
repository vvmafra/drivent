import { Booking } from "@prisma/client";
import Joi from "joi";

export const schemaBooking = Joi.object<Booking>({
    roomId: Joi.number().required()
})