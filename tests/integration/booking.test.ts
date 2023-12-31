import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import * as jwt from 'jsonwebtoken';
import { createEnrollmentWithAddress, 
    createHotel, 
    createTicket, 
    createUser, 
    createTicketWithHotel, 
    createRooms, 
    createTicketTypeRemote,
    createTicketTypeWithoutHotel,
    createRoomsWithoutCapacity} from '../factories';
import { TicketStatus } from '@prisma/client';
import { createBooking, createBookingRandomRoomId } from '../factories/booking-factory';
import faker from '@faker-js/faker';

const server = supertest(app)

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 if there is no session for given token',  async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

   
    describe('when token is valid', () => {
        it('should respond with status 404 if user doenst have a booking yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const room = await createRooms(hotel.id)
    
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
            expect(response.status).toBe(httpStatus.NOT_FOUND)
        })
        

        it('should respond with status 200 and with booking data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const room = await createRooms(hotel.id)
            const booking = await createBooking(user.id, room.id)

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.OK)
            expect(response.body).toEqual({
                id: booking.id,
                Room: {
                    id: room.id,
                    name: room.name,
                    capacity: room.capacity,
                    hotelId: room.hotelId,
                    createdAt: room.createdAt.toISOString(),
                    updatedAt: room.updatedAt.toISOString()
                }
            })
        })
    })
})

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })
    
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 if there is no session for given token',  async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
   
    describe('when token is valid', () => {
        it('should respond with status 403 if ticket is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const room = await createRooms(hotel.id)
            await createBooking(user.id, room.id)
    
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({roomId: room.id})
    
            expect(response.status).toBe(httpStatus.FORBIDDEN)
        })

        it('should respond with status 403 if ticket doesnt include hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithoutHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const room = await createRooms(hotel.id)
            await createBooking(user.id, room.id)
    
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({roomId: room.id})

            expect(response.status).toBe(httpStatus.FORBIDDEN)
        })

        it('should respond with status 403 if ticket doesnt isnt paid yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel()
            const room = await createRooms(hotel.id)
            await createBooking(user.id, room.id)
    
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({roomId: room.id})

            expect(response.status).toBe(httpStatus.FORBIDDEN)
        })

        it('should respond with status 403 if room has no capacity anymore', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const room = await createRoomsWithoutCapacity(hotel.id)
            await createBooking(user.id, room.id)
    
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({roomId: room.id})

            expect(response.status).toBe(httpStatus.FORBIDDEN)
        })

        it('should respond with status 404 if room doesnt exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID); 
            const hotel = await createHotel()
            const room = await createRooms(hotel.id)
    
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({roomId: 1})
            
            
            expect(response.status).toBe(httpStatus.NOT_FOUND)
        })

        it('should respond with status 200 and booking id', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const room = await createRooms(hotel.id)
            const booking = await createBooking(user.id, room.id)
    
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({roomId: room.id})
    
            expect(response.status).toEqual(httpStatus.OK)
            expect(response.body).toEqual({bookingId: expect.any(Number)})
        })
        
    })
})

describe('PUT /booking/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const number = faker.datatype.number({max:100})
        const response = await server.put(`/booking/${number}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const number = faker.datatype.number({max:100})
        
        const response = await server.put(`/booking/${number}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 if there is no session for given token',  async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const number = faker.datatype.number({max:100})

        const response = await server.put(`/booking/${number}`).set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

   
    describe('when token is valid', () => {
        it('should respond with status 403 if user doesnt have a booking yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const room = await createRooms(hotel.id)
            
            const number = faker.datatype.number({max:100})
            const response = await server.put(`/booking/${number}`)
            .set('Authorization', `Bearer ${token}`)
            .send({roomId: room.id})
    
            expect(response.status).toBe(httpStatus.FORBIDDEN)
        })

        it('should respond with status 403 if room has no capacity', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const room = await createRoomsWithoutCapacity(hotel.id)
            const booking = await createBooking(user.id, room.id)
            
            const response = await server.put(`/booking/${booking.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({roomId: room.id})
    
            expect(response.status).toBe(httpStatus.FORBIDDEN)
        })

        // it('should respond with status 404 if room doesnt exist', async () => {
        //     const user = await createUser();
        //     const token = await generateValidToken(user);
        //     const enrollment = await createEnrollmentWithAddress(user);
        //     const ticketType = await createTicketWithHotel();
        //     await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        //     const hotel = await createHotel()
        //     const fakeRoomNumber = faker.datatype.number({max: 5}) 
        //     const number = faker.datatype.number({max:100})
            
        //     const response = await server.put(`/booking/${number}`)

        //     .set('Authorization', `Bearer ${token}`)
        //     .send({roomId: fakeRoomNumber})
    
        //     expect(response.status).toBe(httpStatus.NOT_FOUND)
        // })
        
        it('should respond with status 200 and booking id', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const room = await createRooms(hotel.id)
            const booking = await createBooking(user.id, room.id)
    
            const response = await server.put(`/booking/${booking.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({roomId: room.id})
    
            expect(response.status).toEqual(httpStatus.OK)
            expect(response.body).toEqual({bookingId: expect.any(Number)})
        })
    })
})