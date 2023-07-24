import bookingsRepository from "@/repositories/bookings-repository"
import bookingService from "@/services/booking-service"
import { notFoundError } from "@/errors"
import ticketsRepository from "@/repositories/tickets-repository"
import enrollmentRepository from "@/repositories/enrollment-repository"
import hotelsRepository from "@/repositories/hotels-repository"


describe("Booking Service Unit Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })


    describe("get booking tests", () => {
        it("should return booking", async () => {
            jest.spyOn(bookingsRepository, "findBookingObj").mockResolvedValueOnce(
                {id: 1, 
                Room: { id: 1, 
                        name: "202", 
                        capacity: 3, 
                        hotelId: 1, 
                        createdAt: new Date(),
                        updatedAt: new Date() }}
            )

            const booking = await bookingService.getBookings(1)
            const obj = {id: 1, Room: { id: 1, 
                name: "202", 
                capacity: 3, 
                hotelId: 1, 
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)}
            }

            expect(booking).toEqual(obj)
        })

        it("should respond with 404 when booking is not found", async () => {
            jest.spyOn(bookingsRepository, "findBookingObj").mockResolvedValueOnce(null)

            const booking = bookingService.getBookings(1)
            expect(booking).rejects.toEqual(notFoundError())
        })
    })

    describe("post booking tests", () => {
        it("should respond with 403 when ticket is remote", async () => {
            jest.spyOn(enrollmentRepository, "findUser").mockImplementationOnce((): any => {
                return {
                    id: 1,
                    userId: 1
                }
            })
            jest.spyOn(hotelsRepository, "findRoom").mockImplementationOnce((): any => {true})
            jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
                return { 
                    status: "PAID",
                    TicketType: {
                    isRemote: true
                }}
            })

            const booking = bookingService.postBooking(1, 1)
            expect(booking).rejects.toEqual({
                name: 'RemoteError',
                message: 'Ticket is remote'
            })
        })

        it("should respond with 403 when ticket does not include hotel", async () => {
            jest.spyOn(enrollmentRepository, "findUser").mockImplementationOnce((): any => {
                return {
                    id: 1,
                    userId: 1
                }
            })
            jest.spyOn(hotelsRepository, "findRoom").mockImplementationOnce((): any => {true})
            jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
                return { 
                    status: "PAID",
                    TicketType: {
                    isRemote: false,
                    includesHotel: false
                }}
            })

            const booking = bookingService.postBooking(1, 1)
            expect(booking).rejects.toEqual({
                name: 'HotelError',
                message: 'Ticket doesnt include hotel'
            })
        })

        it("should respond with 403 when ticket is not paid yet", async () => {
            jest.spyOn(enrollmentRepository, "findUser").mockImplementationOnce((): any => {
                return {
                    id: 1,
                    userId: 1
                }
            })
            jest.spyOn(hotelsRepository, "findRoom").mockImplementationOnce((): any => {true})
            jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
                return { 
                    status: "RESERVED",
                    TicketType: {
                    isRemote: false,
                    includesHotel: true
                }}
            })

            const booking = bookingService.postBooking(1, 1)
            expect(booking).rejects.toEqual({
                name: 'PaymentError',
                message: 'Ticket isnt paid yet'
            })
        })

        it("should respond with 403 when room has no capacity", async () => {
            jest.spyOn(enrollmentRepository, "findUser").mockImplementationOnce((): any => {
                return {
                    id: 1,
                    userId: 1
                }
            })
            jest.spyOn(hotelsRepository, "findRoom").mockImplementationOnce((): any => {
                   return { 
                    id: 1,
                    capacity: 0,
                    Booking: [1]    
                }
                })
            jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
                return { 
                    status: "PAID",
                    TicketType: {
                    isRemote: false,
                    includesHotel: true
                }}
            })

            const booking = bookingService.postBooking(1, 1)
            expect(booking).rejects.toEqual({
                name: 'RoomError',
                message: 'Room is already full'
            })
        })

        it("should respond with 404 when room does not exist", async () => {
            jest.spyOn(enrollmentRepository, "findUser").mockImplementationOnce((): any => {
                return {
                    id: 1,
                    userId: 1
                }
            })
            jest.spyOn(hotelsRepository, "findRoom").mockImplementationOnce((): any => {
                   return null  
                })
            jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
                return { 
                    status: "PAID",
                    TicketType: {
                    isRemote: false,
                    includesHotel: true
                }}
            })

            const booking = bookingService.postBooking(1, 1)
            expect(booking).rejects.toEqual({
                name: 'NoRoomError',
                message: 'This room doesnt exist'
            })
        })

    })

    describe("put booking tests", () => {
        it("should respond with 403 if user does not have a booking yet", async () => {
          jest.spyOn(bookingsRepository, "findBookingObj").mockImplementationOnce((): any => null);
      
          expect(bookingService.putBooking(1, 1, 1)).rejects.toEqual({
            name: "BookingError",
            message: "This user doesnt have a booking to change",
          });
        });
      })


      it("should respond with 403 when room has no capacity", async () => {
        jest.spyOn(enrollmentRepository, "findUser").mockImplementationOnce((): any => {
            return {
                id: 1,
                userId: 1
            }
        })
        jest.spyOn(hotelsRepository, "findRoom").mockImplementationOnce((): any => {
               return { 
                id: 1,
                capacity: 0,
                Booking: [1]    
            }
            })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return { 
                status: "PAID",
                TicketType: {
                isRemote: false,
                includesHotel: true
            }}
        })

        jest.spyOn(bookingsRepository, "findBookingObj").mockImplementationOnce((): any => { 
            return true
        })
    
        expect(bookingService.putBooking(1, 1, 1)).rejects.toEqual({
          name: "RoomError",
          message: "Room is already full",
        });
      });

      it("should respond with 404 when room does not exist", async () => {
        jest.spyOn(enrollmentRepository, "findUser").mockImplementationOnce((): any => {
            return {
                id: 1,
                userId: 1
            }
        })
        jest.spyOn(hotelsRepository, "findRoom").mockImplementationOnce((): any => {
               return null  
            })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return { 
                status: "PAID",
                TicketType: {
                isRemote: false,
                includesHotel: true
            }}
        })

        jest.spyOn(bookingsRepository, "findBookingObj").mockImplementationOnce((): any => { 
            return true
        })

        const booking = bookingService.putBooking(1, 1, 1)
        expect(booking).rejects.toEqual({
            name: 'NoRoomError',
            message: 'This room doesnt exist'
        })
    })

    })