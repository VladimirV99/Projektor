using System;
using Microsoft.EntityFrameworkCore;
using Movies.API.Entities;
using Movies.API.Models;

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

        public async Task<List<Movie>> GetMoviesByGenreId(int id)
        {
            return await _dbContext
                .Movies
                .Include(m => m.Genres)
                .Include(m => m.People)
                .ThenInclude(x => x.Person)
                .Include(m => m.People)
                .ThenInclude(x => x.Role)
                .Where(m => m.Genres.Select(g => g.Id).Contains(id))
                .ToListAsync();
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

        public async Task<Tuple<List<Movie>, int>> FilterMovies(FilterMoviesRequest request)
        {
                        
            Console.WriteLine("----FILTER REQUEST------------");
            Console.WriteLine(request.Genres);
            if (request.Genres != null)
            {
                foreach (var g in request.Genres)
                {
                    Console.WriteLine(g);
                }
            }
            Console.WriteLine("----FILTER REQUEST------------");
            var page = request.Page ?? 1;
            var perPage = request.PerPage ?? 20;
            var query = _dbContext.Movies
                .Where(request.YearFrom == null ? m => true : m => m.Year >= request.YearFrom)
                .Where(request.YearTo == null ? m => true : m => m.Year <= request.YearTo)
                .Where(request.LengthFrom == null ? m => true : m => m.Length >= request.LengthFrom)
                .Where(request.LengthTo == null ? m => true : m => m.Length <= request.LengthTo)
                .Include(m => m.People)
                .ThenInclude(p => p.Role)
                .Where(request.People == null
                    ? m => true
                    : m => m.People.Select(p => p.PersonId).Intersect(request.People).Any())
                .Include(m => m.Genres)
                .Where(request.Genres == null
                    ? m => true
                    : m => m.Genres.Select(g => g.Id).Intersect(request.Genres).Any());
            
            var count = query.Count();
            var result = await query
                .Skip((page - 1) * perPage)
                .Take(perPage).ToListAsync();
            

            return new Tuple<List<Movie>, int>(result, count);

        }

        public async Task<List<Genre>> GetGenres()
        {
            return await _dbContext.Genres.ToListAsync();
        }
        
    }
}

