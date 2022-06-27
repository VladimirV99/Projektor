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

        public async Task<string?> InsertScreening(Entities.Screening screening)
        {
            var movie = await _dbContext.Movies.Where(m => m.Id == screening.MovieId).SingleOrDefaultAsync();
            if (movie == null)
            {
                // Already checked in the controller, so shouldn't be possible
                return "Movie not found";
            }

            var overlappingScreening = await GetScreeningByHallIdAtMoment(screening.HallId, screening.MovieStart,
                screening.MovieStart.AddMinutes(movie.Length));
            if (overlappingScreening != null)
            {
                return "Creating this screening at the given time would overlap with another screening.";
            }
            await _dbContext.Screenings.AddAsync(screening);
            
            // Cleanup behind the scenes
            _dbContext
                .Screenings
                .RemoveRange(
                    _dbContext
                        .Screenings
                        .Include(s => s.Movie)
                        .Where(s => s.MovieStart.AddMinutes(s.Movie.Length) < DateTime.UtcNow));
                
                
            await _dbContext.SaveChangesAsync();    
            
            return null;
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
            _dbContext.SaveChanges();

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
    }
}

