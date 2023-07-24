import bookingsRepository from "@/repositories/bookings-repository"
import bookingService from "@/services/bookings-service"
import { notFoundError } from "@/errors"


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
            await expect(booking).rejects.toEqual(notFoundError())
        })
    })

})