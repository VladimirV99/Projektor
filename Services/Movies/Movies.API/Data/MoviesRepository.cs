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
            return await _dbContext
                .Movies
                .Include(m => m.Genres)
                .Include(m => m.People)
                    .ThenInclude(x => x.Person)
                .Include(m => m.People)
                    .ThenInclude(x => x.Role)
                .SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Genre?> GetMoviesByGenreId(int id)
        {
            // TODO: Should we call this GetGenre ?
            return await _dbContext
                .Genres
                .Include(g => g.Movies)
                    .ThenInclude(m => m.Genres)
                .SingleOrDefaultAsync(g => g.Id == id);
        }

        public async Task<List<Movie>> GetMoviesByPerson(int id)
        {
            return await _dbContext
                .Movies
                .Include(m => m.People)
                .Where(m => m.People.Select(p => p.PersonId).Contains(id))
                .Include(m => m.Genres)
                .ToListAsync();

        }
        
    }
}

