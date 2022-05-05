using Microsoft.AspNetCore.Mvc;
using Screening.Data;
using Screening.Models;
using AutoMapper;

namespace Screening.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ScreeningController : ControllerBase
    {
        private readonly IScreeningRepository _repository;
        private readonly IMapper _mapper;

        public ScreeningController(IScreeningRepository repository, IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet("[action]/{id}")]
        public async Task<ActionResult<ScreeningModel>> GetScreeningsById(int id)
        {
            var screening = await _repository.GetScreeningById(id);
            return screening == null ? NotFound() : Ok(screening);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetScreenings()
        {
            var screenings = await _repository.GetScreenings();
            return screenings == null ? NotFound() : Ok(screenings);
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetScreeningsByHallId(int id)
        {
            var screenings = await _repository.GetScreeingsByHallId(id);
            return screenings == null ? NotFound() : Ok(screenings);
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetScreeningsByMovieId(int id)
        {
            var screenings = await _repository.GetScreeningsByMovieId(id);
            return screenings == null ? NotFound() : Ok(screenings);
        }

        [HttpGet("[action]/{id}/{moment}")]
        public async Task<IActionResult> GetScreeningsByHallIdAndTime(int id, DateTime moment)
        {
            var screenings = await _repository.GetScreeningByHallIdInSpecificMoment(id, moment);
            return screenings == null ? NotFound() : Ok(screenings);
        }

        [HttpPost("[action]/{hallId}/{moment}/{movieId}")]
        public async Task<bool> InsertScreening(int hallId, int movieId, DateTime moment)
        {
            var movie = await _repository.GetMovieById(movieId);

            if (movie == null) return false;

            await _repository.InsertScreening(new Entities.Screening { Movie = movie, HallId = hallId, MovieStart = moment });
            return true;
        }

        [HttpPatch("[action]/{id}/{moment}")]
        public async Task<bool> UpdateMovieStartTime(int id, DateTime moment)
        {
            return await _repository.UpdateMovieStartTime(id, moment);
        }

        [HttpDelete("[action]/{id}")]
        public async Task<bool> DeleteScreeningById(int id)
        {
            return await _repository.DeleteScreening(id);
        }

        [HttpDelete("[action]/{id}")]
        public async Task<bool> DeleteMovieById(int id)
        {
            return await _repository.DeleteMovie(id);
        }
    }
}
