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
            return screening == null ? NotFound() : Ok(_mapper.Map<ScreeningModel>(screening));
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<List<ScreeningModel>>> GetScreenings()
        {
            var screenings = await _repository.GetScreenings();
            return screenings == null ? NotFound() : Ok(_mapper.Map<List<ScreeningModel>>(screenings));
        }

        [HttpGet("[action]/{id}")]
        public async Task<ActionResult<List<ScreeningModel>>> GetScreeningsByHallId(int id)
        {
            var screenings = await _repository.GetScreeingsByHallId(id);
            return screenings == null ? NotFound() : Ok(_mapper.Map<List<ScreeningModel>>(screenings));
        }

        [HttpGet("[action]/{id}")]
        public async Task<ActionResult<List<ScreeningModel>>> GetScreeningsByMovieId(int id)
        {
            var screenings = await _repository.GetScreeningsByMovieId(id);
            return screenings == null ? NotFound() : Ok(_mapper.Map<List<ScreeningModel>>(screenings));
        }

        [HttpGet("[action]/{id}/{start}/{end}")]
        public async Task<ActionResult<List<ScreeningModel>>> GetScreeningsByHallIdAtTime(int id, DateTime start, DateTime end)
        {
            var screenings = await _repository.GetScreeningByHallIdAtMoment(id, start, end);
            return screenings == null ? NotFound() : Ok(_mapper.Map<List<ScreeningModel>>(screenings));
        }

        [HttpPost("[action]/{hallId}/{movieId}/{moment}")]
        public async Task<ActionResult<bool>> InsertScreening(int hallId, int movieId, DateTime moment)
        {
            var movie = await _repository.GetMovieById(movieId);

            if (movie == null) return NotFound();

            await _repository.InsertScreening(new Entities.Screening { Movie = movie, HallId = hallId, MovieStart = moment });
            return Ok();
        }

        [HttpPatch("[action]/{id}/{moment}")]
        public async Task<ActionResult<bool>> UpdateMovieStartTime(int id, DateTime moment)
        {
            return await _repository.UpdateMovieStartTime(id, moment) ? Ok() : NotFound();
        }

        [HttpDelete("[action]/{id}")]
        public async Task<ActionResult<bool>> DeleteScreeningById(int id)
        {
            return await _repository.DeleteScreening(id) ? Ok() : NotFound();
        }

        [HttpDelete("[action]/{id}")]
        public async Task<ActionResult<bool>> DeleteMovieById(int id)
        {
            return await _repository.DeleteMovie(id) ? Ok() : NotFound();
        }
    }
}
