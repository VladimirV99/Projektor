﻿using AutoMapper;
using Common.Auth;
using Common.Auth.Util;
using Common.EventBus.Events;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reservation.Entities;
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
        private readonly IPublishEndpoint _publishEndpoint;

        public ReservationController(IReservationRepository repository, IMapper mapper,
            IPublishEndpoint publishEndpoint)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));
        }

        [Authorize(Roles = Roles.CUSTOMER)]
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(ReservationModel), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ReservationModel>> CreateReservation([FromBody] CreateReservationRequest request)
        {
            var userInfo = UserClaimsHelper.GetUserFromClaims(User);
            
            // TODO Fetch screening (gRPC)
            // TODO also fetch movie length for price calculation
            var screening = new GetScreeningResponse
            {
                Id = 1,
                Movie = new MovieModel {
                    Id = 1,
                    Title = "Spider-Man: No Way Home"
                    // Length = 148
                },
                MovieStart = new DateTime(2022, 5, 14, 18, 0, 0),
                HallId = 1
            };
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
                Screening = new Screening { Id = screening.Id, MovieStart = screening.MovieStart },
                User = _mapper.Map<User>(userInfo),
                Seats = seats,
                // TODO Price could depend on the movie length, day of the week...
                Price = seats.Aggregate(0, (double acc, Seat s) => acc + s.PriceMultiplier * 300.0)
            };
            await _repository.CreateReservation(reservation);

            // Notify review service
            await _publishEndpoint.Publish(new AddWatchedMovieEvent
            (
                screening.Movie.Id,
                _mapper.Map<Common.EventBus.Models.User>(userInfo),
                reservation.Id,
                screening.MovieStart
            ));
            
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
            if (reservation.User.Id != UserClaimsHelper.GetIdFromClaims(User))
            {
                return Unauthorized();
            }
            
            var result = await _repository.DeleteReservation(id);
            if (!result)
            {
                return NotFound();
            }
            
            // Notify review service
            await _publishEndpoint.Publish(new RemoveWatchedMovieEvent
            (
                reservation.Movie.Id,
                reservation.User.Id,
                reservation.Id
            ));
            
            return Ok();
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
            var screening = new GetScreeningResponse
            {
                Id = 1,
                Movie = new MovieModel {
                    Id = 1,
                    Title = "Spider-Man: No Way Home"
                    // Length = 148
                },
                MovieStart = new DateTime(2022, 5, 14, 18, 0, 0),
                HallId = 1
            };
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