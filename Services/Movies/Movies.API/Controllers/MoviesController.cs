using AutoMapper;
using Common.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.API.Constants;
using Movies.API.Data;
using Movies.API.Models;
using Movies.API.Services;

namespace Movies.API.Controllers
{
	[ApiController]
	[Route("api/v1/[controller]")]
	public class MoviesController : ControllerBase
	{
        private readonly IMoviesRepository _repository;
        private readonly IMoviesService _service;
        private readonly IMapper _mapper;

        public MoviesController(IMoviesRepository repository, IMoviesService service, IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        // TODO: Most of these endpoints probably won't be needed anywhere, but I'm leaving them here for now.
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
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        // [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> CreateMovie([FromBody] CreateOrUpdateMovieRequest createOrUpdateMovieRequest)
        {
            var error = await _service.CreateMovie(createOrUpdateMovieRequest);
            if (error != null)
            {
                return BadRequest(error);
            }
            return StatusCode(StatusCodes.Status201Created);
        }
        
        [HttpPut("[action]")]
        // [Authorize(Roles = Roles.ADMINISTRATOR)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateMovie([FromBody] CreateOrUpdateMovieRequest updateMovieRequest)
        {
            if (updateMovieRequest.Id == null)
            {
                return BadRequest(ErrorMessages.MOVIE_ID_NOT_PROVIDED);
            }
            var error = await _service.UpdateMovie(updateMovieRequest);
            if (error != null)
            {
                return BadRequest(error);
            }
            return Ok();
        }
        
        [HttpDelete("[action]/{id}")]
        // [Authorize(Roles = Roles.ADMINISTRATOR)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            await _repository.DeleteMovie(id);
            return Ok();
            return Ok();
        }
        
        [HttpGet("[action]")]
        public async Task<IActionResult> SearchPeople([FromQuery] string searchString)
        {
            var people = await _repository.SearchPeople(searchString);
            return Ok(_mapper.Map<List<PersonModel>>(people));
        }
        
        [HttpGet("[action]")]
        public async Task<IActionResult> SearchRoles([FromQuery] string searchString)
        {
            var roles = await _repository.SearchRoles(searchString);
            return Ok(_mapper.Map<List<RoleModel>>(roles));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _repository.GetRoles();
            return Ok(_mapper.Map<List<RoleModel>>(roles));
        }
        
    }
}

