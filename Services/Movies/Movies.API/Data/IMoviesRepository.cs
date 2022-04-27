﻿using Movies.API.Entities;
using Movies.API.Models;

namespace Movies.API.Data
{
	public interface IMoviesRepository
	{
		public Task<Movie?> GetMovieById(int id);
		public Task<List<Movie>> GetMoviesByGenreId(int id);
		public Task<List<Movie>> GetMoviesByPerson(int id);
		public Task<Tuple<List<Movie>, int>> FilterMovies(FilterMoviesRequest request);
		public Task<List<Genre>> GetGenres();
		public Task<Tuple<uint, uint, int, int>> GetFilterLimits();
		public Task<string?> CreateMovie(CreateOrUpdateMovieRequest createOrUpdateMovieRequest);
		public Task<string?> UpdateMovie(CreateOrUpdateMovieRequest createOrUpdateMovieRequest);
		public Task DeleteMovie(int id);


	}
}

