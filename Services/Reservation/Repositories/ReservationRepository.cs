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

        public Task CreateHall(Hall hall)
        {
            throw new NotImplementedException();
        }

        public Task<Hall?> GetHallById(int id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateHall(Hall hall)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteHall(int id)
        {
            throw new NotImplementedException();
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
    }
}
