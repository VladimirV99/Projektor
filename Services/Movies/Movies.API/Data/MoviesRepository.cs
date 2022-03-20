using System;
using Microsoft.EntityFrameworkCore;
using Movies.API.Entities;

namespace Movies.API.Data
{
	public class MoviesRepository : IMoviesRepository
	{
		private readonly MovieContext _dbContext;

        public MoviesRepository(MovieContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<Movie?> GetMovieById(int id)
        {
            return await _dbContext.Movies.SingleOrDefaultAsync(m => m.Id == id);
        }
    }
}

