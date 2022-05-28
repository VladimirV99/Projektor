using Reservation.Entities;
using Reservation.Models;

namespace Reservation.Services;

public interface IHallService
{
    Task<Hall> CreateHall(string name, int rows, int columns);
    Task<bool> ResizeHall(int hallId, int rows, int columns);
    Task<bool> CreateSeat(CreateSeatRequest model);
}