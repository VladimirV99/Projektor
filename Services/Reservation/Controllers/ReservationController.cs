using AutoMapper;
using Common.Auth;
using Common.Auth.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reservation.Entities;
using Reservation.Grpc;
using Reservation.Models;
using Reservation.Repositories;

namespace Reservation.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationRepository _repository;
        private readonly IMapper _mapper;
        private readonly ScreeningService _screeningService;

        public ReservationController(IReservationRepository repository, IMapper mapper,
            ScreeningService screeningService)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _screeningService = screeningService ?? throw new ArgumentNullException(nameof(screeningService));
        }

        [Authorize(Roles = Roles.CUSTOMER)]
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(ReservationModel), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ReservationModel>> CreateReservation([FromBody] CreateReservationRequest request)
        {
            var userInfo = UserClaimsHelper.GetUserFromClaims(User);
            
            var screening = await _screeningService.GetScreeningById(request.ScreeningId);
            if (screening == null)
            {
                return NotFound("Screening not found");
            }
            
            var hall = await _repository.GetHallById(screening.HallId);
            if (hall == null)
            {
                return NotFound("Screening hall not found");
            }
            
            // Check seats
            ModelState.Clear();
            var seats = new List<Seat>();
            foreach (var seat in request.Seats.DistinctBy(s => (s.Row, s.Column)))
            {
                var seatEntity = await _repository.GetSeat(hall.Id, seat.Row, seat.Column);
                // Check if seat exists
                if (seatEntity == null)
                {
                    ModelState.TryAddModelError(nameof(request.Seats), $"Seat {seat.Row}/{seat.Column} doesn't exist");
                    continue;
                }
                
                // Check is seat already reserved
                if (await _repository.IsSeatReserved(request.ScreeningId, seat.Row, seat.Column))
                {
                    ModelState.TryAddModelError(nameof(request.Seats), $"Seat {seat.Row}/{seat.Column} is already reserved");
                    continue;
                }
                
                seats.Add(seatEntity);
            }
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }
            
            // Create reservation
            var reservation = new Entities.Reservation
            {
                Movie = _mapper.Map<Movie>(screening.Movie),
                Screening = new Entities.Screening { Id = screening.Id, MovieStart = screening.MovieStart },
                User = _mapper.Map<User>(userInfo),
                Seats = seats,
                // TODO Price could depend on the movie length, day of the week...
                Price = seats.Aggregate(0, (double acc, Seat s) => acc + s.PriceMultiplier * 300.0)
            };
            await _repository.CreateReservation(reservation);
            return CreatedAtAction(
                nameof(GetReservation),
                new {Id = reservation.Id},
                _mapper.Map<ReservationModel>(reservation)
            );
        }
        
        [Authorize(Roles = Roles.CUSTOMER)]
        [HttpDelete("[action]/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CancelReservation(int id)
        {
            var reservation = await _repository.GetReservationById(id);
            if (reservation == null)
            {
                return NotFound();
            }

            // Check if reservation belongs to user trying to cancel it
            if (reservation.User.Id == UserClaimsHelper.GetIdFromClaims(User))
            {
                return Unauthorized();
            }
            
            var result = await _repository.DeleteReservation(id);
            return result ? Ok() : NotFound();
        }
        
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        [HttpDelete("[action]/{screeningId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CancelScreening(int screeningId)
        {
            await _repository.DeleteReservationsForScreening(screeningId);
            return Ok();
        }
        
        [HttpGet("[action]/{screeningId}")]
        [ProducesResponseType(typeof(IEnumerable<IEnumerable<SeatModel>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<IEnumerable<SeatModel>>>> GetSeatsForScreening(int screeningId)
        {
            var screening = await _screeningService.GetScreeningById(screeningId);
            if (screening == null)
            {
                return NotFound("Screening not found");
            }

            var hall = await _repository.GetHallById(screening.HallId);
            if (hall == null)
            {
                return NotFound("Screening hall not found");
            }

            var seats = await _repository.GetSeatsByHallId(screening.HallId);

            var response = new List<List<SeatStatus>>();
            for (var i = 0; i < hall.Rows; i++)
            {
                var row = new List<SeatStatus>();
                for (var j = 0; j < hall.Columns; j++)
                {
                    row.Add(new SeatStatus {Reserved = true, PriceMultiplier = 0f});
                }
                response.Add(row);
            }
            
            foreach (var seat in seats)
            {
                response[seat.Row][seat.Column].Reserved = false;
                response[seat.Row][seat.Column].PriceMultiplier = seat.PriceMultiplier;
            }
            
            var reservedSeats = await _repository.GetReservedSeats(screeningId);
            foreach (var seat in reservedSeats)
            {
                response[seat.Row][seat.Column].Reserved = true;
            }

            return Ok(response);
        }
        
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(ReservationModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ReservationModel>> GetReservation(int id)
        {
            var reservation = await _repository.GetReservationById(id);
            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ReservationModel>(reservation));
        }

        [Authorize(Roles = Roles.CUSTOMER)]
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<ReservationModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ReservationModel>>> GetUserReservations()
        {
            var userId = UserClaimsHelper.GetIdFromClaims(User);
            var reservations = await _repository.GetReservationsByUser(userId);
            return Ok(_mapper.Map<IEnumerable<ReservationModel>>(reservations));
        }
    }
}