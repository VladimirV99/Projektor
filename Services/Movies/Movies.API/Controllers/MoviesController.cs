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

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMoviesByPerson(int id)
        {
            // TODO: Do we need a separate model here?
            // Something like MovieSimple that just has basic movie info and excludes people and genres?
            // If so, we would also use it for GetMoviesByGenreId
            // The idea is that when you're searching for a movie based on something we just give you some basic
            // info and then if you want details you gotta click on it and go to a separate page which gives you
            // the full model.
            var movies = await _repository.GetMoviesByPerson(id);
            return Ok(_mapper.Map<List<Movie>, List<MovieModel>>(movies));
        }

    }
}

