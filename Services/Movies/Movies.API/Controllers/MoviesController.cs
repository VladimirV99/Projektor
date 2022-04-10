using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
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

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMovieById(int id)
        {
            var movie = await _repository.GetMovieById(id);
            return movie == null ? NotFound() : Ok(_mapper.Map<Movie, MovieModel>(movie));
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMoviesByGenre(int id)
        {
            var movies = await _repository.GetMoviesByGenreId(id);
            return Ok(_mapper.Map<List<Movie>, List<MovieModel>>(movies));
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMoviesByPerson(int id)
        {
            var movies = await _repository.GetMoviesByPerson(id);
            return Ok(_mapper.Map<List<Movie>, List<MovieModel>>(movies));
        }
        
        [HttpGet("[action]")]
        public async Task<IActionResult> FilterMovies([FromQuery] FilterMoviesRequest request)
        {
            var (movies, count) = await _repository.FilterMovies(request);
            return Ok(new PaginatedMovieList {Movies = _mapper.Map<List<Movie>, List<MovieModel>>(movies), Count = count});
        }
    }
}

