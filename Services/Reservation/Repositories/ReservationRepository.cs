using Microsoft.EntityFrameworkCore;
using Reservation.Data;
using Reservation.Entities;

namespace Reservation.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly ReservationContext _dbContext;

        public ReservationRepository(ReservationContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task CreateHall(Hall hall)
        {
            _dbContext.Halls.Add(hall);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Hall?> GetHallById(int id)
        {
            return await _dbContext.Halls.FindAsync(id);
        }

        public async Task<IEnumerable<Hall>> GetHalls()
        {
            return await _dbContext.Halls.ToListAsync();
        }

        public async Task UpdateHall(Hall hall)
        {
            _dbContext.Halls.Update(hall);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> DeleteHall(int id)
        {
            var hall = await _dbContext.Halls.FindAsync(id);
            if (hall == null)
            {
                return false;
            }
            
            _dbContext.Halls.Remove(hall);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task CreateSeat(Seat seat)
        {
            _dbContext.Seats.Add(seat);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Seat?> GetSeat(int hallId, int row, int column)
        {
            return await _dbContext.Seats.FindAsync(hallId, row, column);
        }

        public async Task<bool> UpdateSeatPrice(int hallId, int row, int column, float newPriceMultiplier)
        {
            var seat = await _dbContext.Seats.FindAsync(hallId, row, column);
            if (seat == null)
            {
                return false;
            }

            seat.PriceMultiplier = newPriceMultiplier;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSeat(int hallId, int row, int column)
        {
            var seat = await _dbContext.Seats.FindAsync(hallId, row, column);
            if (seat == null)
            {
                return false;
            }
            
            _dbContext.Seats.Remove(seat);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Seat>> GetSeatsByHallId(int hallId)
        {
            return await _dbContext.Seats.Where(s => s.HallId == hallId).ToListAsync();
        }

        public async Task<IEnumerable<Seat>> GetReservedSeats(int screeningId)
        {
            return await _dbContext.Reservations
                .Where(r => r.Screening.Id == screeningId)
                .Include(r => r.Seats)
                .SelectMany(r => r.Seats)
                .ToListAsync();
        }

        public async Task CreateReservation(Entities.Reservation reservation)
        {
            _dbContext.Reservations.Add(reservation);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Entities.Reservation?> GetReservationById(int id)
        {
            return await _dbContext.Reservations
                .Where(r => r.Id == id)
                .Include(r => r.Seats)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<Entities.Reservation>> GetReservationsByUser(string userId)
        {
            return await _dbContext.Reservations
                .Where(r => r.User.Id == userId)
                .Include(r => r.Seats)
                .ToListAsync();
        }

        public async Task<bool> DeleteReservation(int id)
        {
            var reservation = await _dbContext.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return false;
            }
            
            _dbContext.Reservations.Remove(reservation);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task DeleteReservationsForScreening(int screeningId)
        {
            var reservations = await _dbContext.Reservations
                .Where(r => r.Screening.Id == screeningId)
                .ToListAsync();
            _dbContext.Reservations.RemoveRange(reservations);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> IsSeatReserved(int screeningId, int row, int column)
        {
            var result = await _dbContext.Reservations
                .Where(r => r.Screening.Id == screeningId)
                .Include(r => r.Seats)
                .SelectMany(r => r.Seats)
                .Where(s => s.Row == row && s.Column == column)
                .SingleOrDefaultAsync();
            return result != null;
        }
    }
}
