import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/bookings-repository';

async function getBookings(userId: number) {
  const bookings = await bookingRepository.findBookings(userId);
  if (!bookings) throw notFoundError();
  return bookings;
}

const bookingService = { getBookings };

export default bookingService;