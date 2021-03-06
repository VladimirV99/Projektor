using AutoMapper;
using Common.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.API.Constants;
using Movies.API.Grpc;
using Movies.API.Models;
using Movies.API.Services;
using Movies.Common.Data;
using Movies.Common.Models;

namespace Movies.API.Controllers
{
	[ApiController]
	[Route("api/v1/[controller]")]
	public class MoviesController : ControllerBase
	{
        private readonly IMoviesRepository _repository;
        private readonly IMoviesService _service;
        private readonly ScreeningService _screeningService;
        private readonly IMapper _mapper;

        public MoviesController(IMoviesRepository repository, IMoviesService service, IMapper mapper, ScreeningService screeningService)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _screeningService = screeningService ?? throw new ArgumentNullException(nameof(screeningService));
        }
        
        // TODO: Most of these endpoints probably won't be needed anywhere, but I'm leaving them here for now.
        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(MovieModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MovieModel>> GetMovieById(int id)
        {
            var movie = await _repository.GetMovieById(id);
            return movie == null ? NotFound() : Ok(_mapper.Map<MovieModel>(movie));
        }

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(IEnumerable<MovieModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieModel>>> GetMoviesByGenre(int id)
        {
            var movies = await _repository.GetMoviesByGenreId(id);
            return Ok(_mapper.Map<IEnumerable<MovieModel>>(movies));
        }

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(IEnumerable<MovieModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieModel>>> GetMoviesByPerson(int id)
        {
            var movies = await _repository.GetMoviesByPerson(id);
            return Ok(_mapper.Map<IEnumerable<MovieModel>>(movies));
        }
        
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(PaginatedPeopleList), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedMovieList>> FilterMovies([FromQuery] FilterMoviesRequest request)
        {
            var (movies, count) = await _repository.FilterMovies(request);
            return Ok(new PaginatedMovieList {Movies = _mapper.Map<List<MovieModel>>(movies), Count = count});
        }
        
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(GenreSimpleModel), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<GenreSimpleModel>>> GetGenres()
        {
            var genres = await _repository.GetGenres();
            return Ok(_mapper.Map<IEnumerable<GenreSimpleModel>>(genres));
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(FilterLimits), StatusCodes.Status200OK)]
        public async Task<ActionResult<FilterLimits>> GetFilterLimits()
        {
            var (yearMin, yearMax, lengthMin, lengthMax) = await _repository.GetFilterLimits();
            return Ok(new FilterLimits{YearMax = yearMax, YearMin = yearMin, LengthMax = lengthMax, LengthMin = lengthMin});
        }
        
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
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
        [Authorize(Roles = Roles.ADMINISTRATOR)]
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
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var success = await _screeningService.DeleteMovie(id);
            if (!success)
            {
                return BadRequest();
            }
            await _repository.DeleteMovie(id);
            return Ok();
        }
        
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<PersonModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PersonModel>>> SearchPeople([FromQuery] string searchString)
        {
            var people = await _repository.SearchPeople(searchString);
            return Ok(_mapper.Map<IEnumerable<PersonModel>>(people));
        }
        
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<RoleModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<RoleModel>>> SearchRoles([FromQuery] string searchString)
        {
            var roles = await _repository.SearchRoles(searchString);
            return Ok(_mapper.Map<IEnumerable<RoleModel>>(roles));
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<RoleModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<RoleModel>> GetRoles()
        {
            var roles = await _repository.GetRoles();
            return Ok(_mapper.Map<List<RoleModel>>(roles));
        }

        [HttpGet("[action]")]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        [ProducesResponseType(typeof(PaginatedPeopleList), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedPeopleList>> SearchPeopleAdmin([FromQuery] string? searchString, [FromQuery] int page = 1)
        {
            var (people, count) = await _repository.SearchPeopleAdmin(searchString ?? "", page);
            return Ok(new PaginatedPeopleList { People = _mapper.Map<List<PersonModel>>(people), Count = count });
        }

        [HttpDelete("[action]/{id}")]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeletePerson(int id)
        {
            await _repository.DeletePerson(id);
            return Ok();
        }
        
        [HttpPut("[action]")]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdatePerson([FromBody] CreateOrUpdatePersonRequest updatePersonRequest)
        {
            if (updatePersonRequest.Id == null)
            {
                return BadRequest(ErrorMessages.MOVIE_ID_NOT_PROVIDED);
            }
            var error = await _service.UpdatePerson(updatePersonRequest);
            if (error != null)
            {
                return BadRequest(error);
            }
            return Ok();
        }
    
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        public async Task<IActionResult> CreatePerson([FromBody] CreateOrUpdatePersonRequest createOrUpdatePersonRequest)
        {
            await _service.CreatePerson(createOrUpdatePersonRequest);
            return StatusCode(StatusCodes.Status201Created);
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<MovieModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieModel>>> GetCurrentMovies()
        {
            var movies = await _screeningService.GetCurrentMovies();
            return Ok(_mapper.Map<IEnumerable<MovieModel>>(movies));
        }
        
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<MovieModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieModel>>> GetFutureMovies()
        {
            var movies = await _screeningService.GetFutureMovies();
            return Ok(_mapper.Map<IEnumerable<MovieModel>>(movies));
        }
    }
}

