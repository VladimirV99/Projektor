using Microsoft.AspNetCore.Mvc;
using Screening.Data;

namespace Screening.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ScreeningController : ControllerBase
    {
        private readonly IScreeningRepository _repository;

        public ScreeningController(IScreeningRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetScreeningsById(int id)
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
        public IActionResult GetScreeningsByHallIdAndTime(int id, DateTime moment)
        {
            var screenings = _repository.GetScreeningByHallIdInSpecificMoment(id, moment);
            return screenings == null ? NotFound() : Ok(screenings);
        }

        [HttpPatch("[action]/{id}/{moment}")]
        public bool UpdateMovieStartTime(int id, DateTime moment)
        {
            return _repository.UpdateMovieStartTime(id, moment);
        }

        [HttpDelete("[action]/{id}")]
        public bool DeleteScreeningById(int id)
        {
            return _repository.DeleteScreening(id);
        }

        [HttpDelete("[action]/{id}")]
        public bool DeleteMovieById(int id)
        {
            return _repository.DeleteMovie(id);
        }
    }
}
