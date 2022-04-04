﻿using Movies.API.Entities;
using Movies.API.Models;

namespace Movies.API.Data
{
	public interface IMoviesRepository
	{
		public Task<Movie?> GetMovieById(int id);
		public Task<List<Movie>> GetMoviesByGenreId(int id);
		public Task<List<Movie>> GetMoviesByPerson(int id);
		public Task<List<Movie>> FilterMovies(FilterMoviesRequest request);
	}
}

