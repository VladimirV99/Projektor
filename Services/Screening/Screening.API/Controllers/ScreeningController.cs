using Microsoft.AspNetCore.Mvc;
using Screening.Common.Data;
using Screening.API.Models;
using AutoMapper;
using Screening.Common.Entities;
using Microsoft.AspNetCore.Authorization;
using Common.Auth;
using Common.EventBus.Events;
using MassTransit;

namespace Screening.Common.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ScreeningController : ControllerBase
    {
        private readonly IScreeningRepository _repository;
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;

        public ScreeningController(IScreeningRepository repository, IMapper mapper, IPublishEndpoint publishEndpoint)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));
        }

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(ScreeningModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ScreeningModel>> GetScreeningById(int id)
        {
            var screening = await _repository.GetScreeningById(id);
            return screening == null ? NotFound() : Ok(_mapper.Map<ScreeningModel>(screening));
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<ScreeningModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ScreeningModel>>> GetScreenings()
        {
            var screenings = await _repository.GetScreenings();
            return Ok(_mapper.Map<IEnumerable<ScreeningModel>>(screenings));
        }

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(IEnumerable<ScreeningModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<ActionResult<IEnumerable<ScreeningModel>>> GetScreeningsByHallId(int id)
        {
            var hall = _repository.GetHallById(id);
            if(hall == null) return NotFound();

            var screenings = await _repository.GetScreeingsByHallId(id);
            return Ok(_mapper.Map<IEnumerable<ScreeningModel>>(screenings));
        }

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(IEnumerable<ScreeningModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<ScreeningModel>>> GetScreeningsByMovieId(int id)
        {
            var movie = await _repository.GetMovieById(id);
            if (movie == null)
            {
                return NotFound();
            }

            var screenings = await _repository.GetScreeningsByMovieId(id);
            return Ok(_mapper.Map<IEnumerable<ScreeningModel>>(screenings));
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<ScreeningModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<ActionResult<IEnumerable<ScreeningModel>>> GetScreeningsByHallIdAtTime([FromBody] GetScreeningsByHallIdAtTimeRequest request)
        {
            var hall = _repository.GetHallById(request.HallId);
            if (hall == null) return NotFound();

            var screenings = await _repository.GetScreeningByHallIdAtMoment(request.HallId, request.Start, request.End);
            return Ok(_mapper.Map<IEnumerable<ScreeningModel>>(screenings));
        }

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(IEnumerable<HallModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<ActionResult<HallModel>> GetHallById(int id)
        {
            var hall = await _repository.GetHallById(id);
            if(hall == null) return NotFound();

            return Ok(_mapper.Map<HallModel>(hall));
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<HallModel>), StatusCodes.Status200OK)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<ActionResult<HallModel>> GetHalls()
        {
            var halls = await _repository.GetAllHalls();
            return Ok(_mapper.Map<IEnumerable<HallModel>>(halls));
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<HallModel>), StatusCodes.Status200OK)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<ActionResult<HallModel>> GetHallsBySearchString([FromQuery] string searchString)
        {
            var halls = await _repository.GetHallsBySearchString(searchString);
            return Ok(_mapper.Map<IEnumerable<HallModel>>(halls));
        }
        // This is a debug function
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<MovieModel>), StatusCodes.Status200OK)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<ActionResult<MovieModel>> GetMovies()
        {
            var movies = await _repository.GetMovies();
            return Ok(_mapper.Map<IEnumerable<MovieModel>>(movies));
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> InsertScreening([FromBody] InsertScreeningRequest request)
        {
            var movie = await _repository.GetMovieById(request.MovieId);

            if (movie == null) return BadRequest();

            await _repository.InsertScreening(_mapper.Map<Entities.Screening>(request));
            return Ok();
        }

        // This is a debug function, movies should be fetched from movie service
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> InsertMovie([FromBody] InsertMovieRequest request)
        {
            var movie = await _repository.GetMovieById(request.Id);

            if (movie != null) return BadRequest();

            await _repository.InsertMovie(_mapper.Map<Movie>(request));
            return StatusCode(StatusCodes.Status201Created);
        }

        // This is a debug function, halls should be fetched from reservation service
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> InsertHall([FromBody] InsertHallRequest request)
        {
            var hall = await _repository.GetHallById(request.Id);

            if(hall != null) return BadRequest();

            await _repository.InsertHall(_mapper.Map<Hall>(request));
            return StatusCode(StatusCodes.Status201Created);
        }

        [HttpPatch("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> UpdateScreening([FromBody] UpdateScreeningRequest request)
        {
            var screening = await _repository.GetScreeningById(request.ScreeningId);
            if (screening == null)
            {
                return NotFound();
            }

            if (request.Moment == screening.MovieStart)
            {
                return Ok();
            }
            
            var oldTime = screening.MovieStart;
            await _repository.UpdateScreening(request.ScreeningId, request.Moment);
                
            // Notify reservation service
            await _publishEndpoint.Publish(new RescheduleScreeningEvent(
                screening.Id,
                oldTime,
                request.Moment
            ));
            
            return Ok();
        }

        [HttpDelete("[action]/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<ActionResult> DeleteScreeningById(int id)
        {
            var result = await _repository.DeleteScreening(id);
            if (!result)
            {
                return NotFound();
            }

            // Notify reservation service
            await _publishEndpoint.Publish(new CancelScreeningEvent(id));
            
            return Ok();
        }

        // This is a debug function, movies should be fetched from movie service
        [HttpDelete("[action]/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> DeleteMovieById(int id)
        {
            return await _repository.DeleteMovie(id) ? Ok() : NotFound();
        }
    }
}
