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

    }
}
