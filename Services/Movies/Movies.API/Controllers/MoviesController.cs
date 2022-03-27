using System;
using Microsoft.AspNetCore.Mvc;
using Movies.API.Data;
using Movies.API.Models;

namespace Movies.API.Controllers
{
	[ApiController]
	[Route("api/v1/[controller]")]
	public class MoviesController : ControllerBase
	{
        private readonly IMoviesRepository _repository;

        public MoviesController(IMoviesRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMovieById(int id)
        {
            var movieModel = await _repository.GetMovieById(id);
            return movieModel == null ? NotFound() : Ok(movieModel);
        }
        
    }
}

