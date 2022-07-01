using Microsoft.EntityFrameworkCore;
using Screening.Common.Entities;

namespace Screening.Common.Data
{
    public class ScreeningRepository : IScreeningRepository
    {
        private readonly ScreeningContext _dbContext;

        public ScreeningRepository(ScreeningContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<IEnumerable<Entities.Screening>> GetScreenings()
        {
            return await _dbContext
                .Screenings
                .Include(m => m.Movie)
                .Include(h => h.Hall)
                .ToListAsync();
        }
        public async Task<IEnumerable<Hall>> GetAllHalls()
        {
            return await _dbContext
                .Halls
                .ToListAsync();
        }

        public async Task<Entities.Screening?> GetScreeningById(int id)
        {
            return await _dbContext
                .Screenings
                .Include(m => m.Movie)
                .Include(h => h.Hall)
                .SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<Entities.Screening>> GetScreeningsByHallId(int id)
        {
            return await _dbContext
                .Screenings
                .Where(m => m.Hall.Id == id)
                .Include(m => m.Movie)
                .ToListAsync();
        }

        public async Task<IEnumerable<Entities.Screening>> GetScreeningsByMovieId(int id)
        {
            return await _dbContext
                .Screenings
                .Where(m => m.Movie.Id == id)
                .Include(h => h.Hall)
                .Include(s => s.Movie)
                .Where(s => s.MovieStart.AddMinutes(s.Movie.Length) < DateTime.UtcNow)
                .ToListAsync();
        }

        public async Task<Entities.Screening?> GetScreeningByHallIdAtMoment(int hallId, DateTime start, DateTime end)
        {
            return await _dbContext
                .Screenings
                .Where(m => m.HallId == hallId)
                .Include(m => m.Movie)
                .Where(
                  m => (m.MovieStart > start && m.MovieStart < end) 
                    || (m.MovieStart <= start && m.MovieStart.AddMinutes(m.Movie.Length) > start)
                )
                .FirstOrDefaultAsync();
        }

        public async Task<Movie?> GetMovieById(int id)
        {
            return await _dbContext
                .Movies
                .FindAsync(id);
        }

        public async Task<IEnumerable<Movie>> GetMovies()
        {
            return await _dbContext
                .Movies
                .ToListAsync();
        }
        public async Task<IEnumerable<Movie>> GetMoviesBySearchString(string searchString)
        {
            searchString = searchString.Trim().ToLower();
            return await _dbContext
                .Movies
                .Where(m => m.Title.ToLower().Contains(searchString))
                .ToListAsync();
        }

        public async Task<IEnumerable<Hall>> GetHallsBySearchString(string searchString)
        {
            searchString = searchString.Trim().ToLower();
            return await _dbContext
                .Halls
                .Where(h => h.Name.ToLower().Contains(searchString))
                .ToListAsync();
        }

        public async Task<Hall?> GetHallById(int id)
        {
            return await _dbContext
                .Halls
                .FindAsync(id);
        }

        private async Task<List<int>> Cleanup()
        {
            var cleanupQuery = _dbContext
                .Screenings
                .Include(s => s.Movie)
                .Where(s => s.MovieStart.AddMinutes(s.Movie.Length) < DateTime.UtcNow);

            var ids = await cleanupQuery.Select(q => q.Id).ToListAsync();
            
            _dbContext
                .Screenings
                .RemoveRange(cleanupQuery);

            await _dbContext.SaveChangesAsync();

            return ids;
        }
        
        public async Task<Tuple<string?, List<int>>> InsertScreening(Entities.Screening screening)
        {
            var movie = await _dbContext.Movies.Where(m => m.Id == screening.MovieId).SingleOrDefaultAsync();
            if (movie == null)
            {
                // Already checked in the controller, so shouldn't be possible
                return new Tuple<string?, List<int>>("Movie not found", new List<int>());
            }

            var overlappingScreening = await GetScreeningByHallIdAtMoment(screening.HallId, screening.MovieStart,
                screening.MovieStart.AddMinutes(movie.Length));
            if (overlappingScreening != null)
            {
                return new Tuple<string?, List<int>>("Creating this screening at the given time would overlap with another screening.", new List<int>());
            }
            await _dbContext.Screenings.AddAsync(screening);

            var ids = await Cleanup();

            await _dbContext.SaveChangesAsync();    
            
            return new Tuple<string?, List<int>>(null, ids);
        }
        public async Task InsertMovie(Movie movie)
        {
            await _dbContext.Movies.AddAsync(movie);
            await _dbContext.SaveChangesAsync();
        }
        public async Task InsertHall(Hall hall)
        {
            await _dbContext.Halls.AddAsync(hall);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<string?> UpdateScreening(int id, DateTime moment)
        {
            
            var screening = await _dbContext
                .Screenings
                .Where(s => s.Id == id)
                .Include(s => s.Movie)
                .SingleOrDefaultAsync();
            
            if (screening == null)
            {
                return "Screening not found.";
            }

            var overlappingScreening =
                await GetScreeningByHallIdAtMoment(screening.HallId, moment, moment.AddMinutes(screening.Movie.Length));

            if (overlappingScreening != null && overlappingScreening.Id != screening.Id)
            {
                return "Changing this screening's time would overlap with another screening.";
            }

            screening.MovieStart = moment;
            await _dbContext.SaveChangesAsync();
            return null;
        }

        public async Task<bool> DeleteScreening(int id)
        {
            var screening = await _dbContext
                .Screenings
                .FindAsync(id);

            if (screening == null) return false;

            _dbContext.Screenings.Remove(screening);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteMovie(int id)
        {
            var movie = await _dbContext
                .Movies
                .FindAsync(id);

            if (movie == null) return false;

            _dbContext.Movies.Remove(movie);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateMovie(int id, string title, int length)
        {
            var movie = await _dbContext.Movies.FirstOrDefaultAsync(m => m.Id == id);
            if (movie == null)
            {
                return true;
            }

            var query =
                from screening1 in _dbContext.Screenings
                join movie1 in _dbContext.Movies on screening1.MovieId equals movie.Id
                from screening2 in _dbContext.Screenings    
                where screening1.MovieId == id
                where screening1.Id != screening2.Id
                where screening1.HallId == screening2.HallId
                where screening2.MovieStart >= screening1.MovieStart
                where screening2.MovieStart <= screening1.MovieStart.AddMinutes(length)
                select 0;

            if (await query.AnyAsync())
            {
                return false;
            }

            movie.Title = title;
            movie.Length = length;

            await _dbContext.SaveChangesAsync();
            return true;

        }

        public async Task<Tuple<bool, List<int>>> DeleteHall(int id)
        {
            var hall = await GetHallById(id);
            if (hall == null)
            {
                return new Tuple<bool, List<int>>(true, new List<int>());
            }

            var ids = await Cleanup();
            
            // Any problems
            var hasPendingScreenings =
                await _dbContext.Screenings
                    .Where(s => s.HallId == id)
                    .Include(s => s.Movie)
                    .Where(s => s.MovieStart.AddMinutes(s.Movie.Length) >= DateTime.UtcNow).AnyAsync();

            if (!hasPendingScreenings)
            {
                _dbContext.Remove(hall);    
            }
            
            await _dbContext.SaveChangesAsync();

            return new Tuple<bool, List<int>>(!hasPendingScreenings, ids);

        }
    }
}

