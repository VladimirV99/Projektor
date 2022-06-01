using AutoMapper;
using Reservation.Entities;
using Reservation.Models;
using Reservation.Repositories;

namespace Reservation.Services
{
    public class HallService : IHallService
    {
        private readonly IReservationRepository _repository;
        private readonly IMapper _mapper;

        public HallService(IReservationRepository repository, IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<Hall> CreateHall(string name, int rows, int columns)
        {
            var hall = new Hall {Name = name, Rows = rows, Columns = columns};
            await _repository.CreateHall(hall);

            for (var row = 0; row < rows; row++)
            {
                for (var column = 0; column < columns; column++)
                {
                    var seat = new Seat {HallId = hall.Id, Row = row, Column = column, PriceMultiplier = 1f};
                    await _repository.CreateSeat(seat);
                }
            }
            
            return hall;
        }

        public async Task<bool> ResizeHall(int hallId, int rows, int columns)
        {
            var hall = await _repository.GetHallById(hallId);
            if (hall == null)
            {
                return false;
            }
            
            // Adjust seat rows
            if (hall.Rows < rows)
            {
                // Add new rows
                await CreateSeatsRange(hall.Id, hall.Rows, rows, 0, hall.Columns);
            }
            else if (hall.Rows > rows)
            {
                // Delete extra rows
                await DeleteSeatsRange(hall.Id, rows, hall.Rows, 0, hall.Columns);
            }
            
            // Adjust seat columns
            if (hall.Columns < columns)
            {
                // Add new columns
                await CreateSeatsRange(hall.Id, 0, rows, hall.Columns, columns);
            }
            else if (hall.Columns > columns)
            {
                // Delete extra columns
                await DeleteSeatsRange(hall.Id, 0, rows, columns, hall.Columns);
            }

            hall.Rows = rows;
            hall.Columns = columns;
            await _repository.UpdateHall(hall);

            return true;
        }

        public async Task<bool> CreateSeat(CreateSeatRequest model)
        {
            // Check if hall exists
            var hall = await _repository.GetHallById(model.HallId);
            if (hall == null)
            {
                return false;
            }
            
            // Check are row/column within bounds
            if (hall.Rows < model.Row || hall.Columns < model.Column)
            {
                return false;
            }

            // Check if seat already exists
            var seat = await _repository.GetSeat(model.HallId, model.Row, model.Column);
            if (seat != null)
            {
                return false;
            }

            await _repository.CreateSeat(_mapper.Map<Seat>(model));
            return true;
        }

        private async Task CreateSeatsRange(int hallId, int rowMin, int rowMax, int colMin, int colMax)
        {
            for (var row = rowMin; row < rowMax; row++)
            {
                for (var column = colMin; column < colMax; column++)
                {
                    var seat = new Seat {HallId = hallId, Row = row, Column = column, PriceMultiplier = 1f};
                    await _repository.CreateSeat(seat);
                }
            }
        }
        
        private async Task DeleteSeatsRange(int hallId, int rowMin, int rowMax, int colMin, int colMax)
        {
            for (var row = rowMin; row < rowMax; row++)
            {
                for (var column = colMin; column < colMax; column++)
                {
                    await _repository.DeleteSeat(hallId, row, column);
                }
            }
        }
    }
}