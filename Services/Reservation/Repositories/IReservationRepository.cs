using Reservation.Entities;

namespace Reservation.Repositories
{
    public interface IReservationRepository
    {
        Task CreateHall(Hall hall);
        Task<Hall?> GetHallById(int id);
        Task<IEnumerable<Hall>> GetHalls();
        Task UpdateHall(Hall hall);
        Task<bool> DeleteHall(int id);
        Task CreateSeat(Seat seat);
        Task<Seat?> GetSeat(int hallId, int row, int column);
        Task<bool> UpdateSeatPrice(int hallId, int row, int column, float newPriceMultiplier);
        Task<bool> DeleteSeat(int hallId, int row, int column);
        Task<IEnumerable<Seat>> GetSeatsByHallId(int hallId);
        Task<IEnumerable<Seat>> GetReservedSeats(int screeningId);
        Task CreateReservation(Entities.Reservation reservation);
        Task<Entities.Reservation?> GetReservationById(int id);
        Task<bool> DeleteReservation(int id);
        Task<bool> IsSeatReserved(int screeningId, int row, int column);
    }
}
