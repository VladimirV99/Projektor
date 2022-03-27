using System;
using AutoMapper;
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

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMovieById(int id)
        {
            var movie = await _repository.GetMovieById(id);
            return movie == null ? NotFound() : Ok(_mapper.Map<Movie, MovieModel>(movie));
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMoviesByGenre(int id)
        {
            var genre = await _repository.GetMoviesByGenreId(id);
            return genre == null ? NotFound() : Ok(_mapper.Map<Genre, GenreWithMoviesModel>(genre));
        }

    }
}

