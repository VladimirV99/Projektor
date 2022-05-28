using Reservation.Entities;

namespace Reservation.Repositories
{
    public interface IReservationRepository
    {
        Task CreateHall(Hall hall);
        Task<Hall?> GetHallById(int id);
        Task UpdateHall(Hall hall);
        Task<bool> DeleteHall(int id);
        Task CreateSeat(Seat seat);
        Task<Seat?> GetSeat(int hallId, int row, int column);
        Task<bool> UpdateSeatPrice(int hallId, int row, int column, float newPriceMultiplier);
        Task<bool> DeleteSeat(int hallId, int row, int column);
    }
}
