using AutoMapper;
using Common.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reservation.Models;
using Reservation.Repositories;
using Reservation.Services;

namespace Reservation.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    // [Authorize(Roles = Roles.ADMINISTRATOR)]
    public class HallController : ControllerBase
    {
        private readonly IReservationRepository _repository;
        private readonly IHallService _hallService;
        private readonly IMapper _mapper;

        public HallController(IReservationRepository repository, IHallService hallService, IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _hallService = hallService ?? throw new ArgumentNullException(nameof(hallService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(HallBasicModel), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<HallBasicModel>> CreateHall([FromBody] CreateHallRequest request)
        {
            var hall = await _hallService.CreateHall(request.Name, request.Rows, request.Columns);
            return CreatedAtAction(
                nameof(GetHallById), 
                new { id = hall.Id },
                _mapper.Map<HallBasicModel>(hall)
            );
        }

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(HallBasicModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<HallBasicModel>> GetHallById(int id)
        {
            var hall = await _repository.GetHallById(id);
            return hall == null ? NotFound() : Ok(_mapper.Map<HallBasicModel>(hall));
        }

        [HttpDelete("[action]/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteHall(int id)
        {
            var result = await _repository.DeleteHall(id);
            return result ? Ok() : NotFound();
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateSeat([FromBody] CreateSeatRequest request)
        {
            var result = await _hallService.CreateSeat(request);
            return result ? StatusCode(StatusCodes.Status201Created) : BadRequest();
        }

        [HttpPut("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateSeatPrice([FromBody] CreateSeatRequest request)
        {
            var result = await _repository.UpdateSeatPrice(
                request.HallId, request.Row, request.Column, request.PriceMultiplier
            );
            return result ? Ok() : NotFound();
        }
        
        [HttpDelete("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteSeat([FromBody] SeatIdRequest request)
        {
            var result = await _repository.DeleteSeat(request.HallId, request.Row, request.Column);
            return result ? Ok() : BadRequest();
        }
    }
}