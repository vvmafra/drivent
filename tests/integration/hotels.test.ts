import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { init } from '@/app';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, 
    createHotel, 
    createTicketType, 
    createTicket, 
    createUser, 
    createTicketTypeRemote, 
    createTicketTypeWithoutHotel, 
    createTicketWithHotel, 
    createRooms } from '../factories';

const server = supertest(app)

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 if there is no session for given token',  async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
    describe('when token is valid', () => {
        it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
            const token = await generateValidToken()

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it('should respond with status 404 when user doesnt have a ticket yet', async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            await createEnrollmentWithAddress(user)

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it('should respond with status 402 when ticket isnt paid yet', async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
        })

        it('should respond with status 402 when ticket is remote', async ()=> {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeRemote();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
        })

        it('should respond with status 402 when ticket doesnt include hotel', async ()=> {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWithoutHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
        })

        it('should respond with status 404 when doesnt exist any hotel', async ()=> {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it('should respond with status 200 and with hotels data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.OK)
            expect(response.body).toEqual([{
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString()
            }])
        })
    })
})

describe('GET /hotel/hotelId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels/:hotelId');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels/:hotelId').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 if there is no session for given token',  async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/hotels/:hotelId').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

    describe('when token is valid', () => { 
        it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
            const token = await generateValidToken()
            const hotel = await createHotel()

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it('should respond with status 404 when user doesnt have a ticket yet', async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            await createEnrollmentWithAddress(user)
            const hotel = await createHotel()

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it('should respond with status 404 when hotel doesnt exist', async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotelId = faker.datatype.number()

            const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it('should respond with status 402 when ticket isnt paid yet', async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel()
            await createRooms(hotel.id)

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
        })

        it('should respond with status 402 when ticket is remote', async ()=> {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeRemote();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            await createRooms(hotel.id)

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
        })

        it('should respond with status 402 when ticket doesnt include hotel', async ()=> {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWithoutHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            await createRooms(hotel.id)

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
        })

        it('should respond with status 200 and with hotel information', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()
            const rooms = await createRooms(hotel.id)

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.OK)
            expect(response.body).toEqual([{
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString(),
                Rooms: {
                    id: expect.any(Number),
                    name: expect.any(String),
                    capacity: expect.any(Number),
                    hotelId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)  
                    }
            }])
        })
    })
})