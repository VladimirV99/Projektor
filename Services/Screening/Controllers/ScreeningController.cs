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

        [HttpDelete("[action]/{id}")]
        public void DeleteScreeningById(int id)
        {
            _repository.DeleteScreening(id);
        }
    }
}
