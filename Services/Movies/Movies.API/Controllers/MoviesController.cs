using AutoMapper;
using Common.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.API.Data;
using Movies.API.Entities;
using Movies.API.Models;

namespace Movies.API.Controllers
{
	[ApiController]
	[Route("api/v1/[controller]")]
	public class MoviesController : ControllerBase
	{
        private readonly IMoviesRepository _repository;
        private readonly IMapper _mapper;

        public MoviesController(IMoviesRepository repository, IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        // TODO: Most of these endpoints probably won't be needed anywhere
        
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMovieById(int id)
        {
            var movie = await _repository.GetMovieById(id);
            return movie == null ? NotFound() : Ok(_mapper.Map<MovieModel>(movie));
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMoviesByGenre(int id)
        {
            var movies = await _repository.GetMoviesByGenreId(id);
            return Ok(_mapper.Map<List<MovieModel>>(movies));
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMoviesByPerson(int id)
        {
            var movies = await _repository.GetMoviesByPerson(id);
            return Ok(_mapper.Map<List<MovieModel>>(movies));
        }
        
        [HttpGet("[action]")]
        public async Task<IActionResult> FilterMovies([FromQuery] FilterMoviesRequest request)
        {
            var (movies, count) = await _repository.FilterMovies(request);
            return Ok(new PaginatedMovieList {Movies = _mapper.Map<List<MovieModel>>(movies), Count = count});
        }
        
        [HttpGet("[action]")]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await _repository.GetGenres();
            return Ok(_mapper.Map<List<GenreSimpleModel>>(genres));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetFilterLimits()
        {
            var (yearMin, yearMax, lengthMin, lengthMax) = await _repository.GetFilterLimits();
            return Ok(new FilterLimits{YearMax = yearMax, YearMin = yearMin, LengthMax = lengthMax, LengthMin = lengthMin});
        }
        
        [HttpPost("[action]")]
        // [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> CreateMovie([FromBody] CreateOrUpdateMovieRequest createOrUpdateMovieRequest)
        {
            var error = await _repository.CreateMovie(createOrUpdateMovieRequest);
            if (error != null)
            {
                return BadRequest(error);
            }
            return Ok();
        }
        
        [HttpPut("[action]")]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> UpdateMovie([FromBody] CreateOrUpdateMovieRequest updateOrUpdateMovieRequest)
        {
            var result = await _repository.UpdateMovie(updateOrUpdateMovieRequest);
            if (result != null)
            {
                return BadRequest(result);
            }
            return Ok();
        }
        
        [HttpDelete("[action]/{id}")]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            await _repository.DeleteMovie(id);
            return Ok();
        }
        
    }
}

