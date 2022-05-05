using System;
using Microsoft.EntityFrameworkCore;

namespace Screening.Data
{
    public class ScreeningRepository : IScreeningRepository
    {
        private readonly ScreeningContext _dbContext;

        public ScreeningRepository(ScreeningContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        async Task<List<Entities.Screening>> IScreeningRepository.GetScreenings()
        {
            return await _dbContext
                .Screenings
                .Include(m => m.Movie)
                .ToListAsync();
        }

        public async Task<Entities.Screening?> GetScreeningById(int id)
        {
            return await _dbContext
                .Screenings
                .Include(m => m.Movie)
                .SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<Entities.Screening>> GetScreeingsByHallId(int id)
        {
            return await _dbContext
                .Screenings
                .Where(m => m.HallId == id)
                .Include(m => m.Movie)
                .ToListAsync();
        }

        public async Task<List<Entities.Screening>> GetScreeningsByMovieId(int id)
        {
            return await _dbContext
                .Screenings
                .Include(m => m.Movie)
                .Where(m => m.Movie.Id == id)
                .ToListAsync();
        }

        public Entities.Screening? GetScreeningByHallIdInSpecificMoment(int id, DateTime moment)
        {
            return _dbContext
                .Screenings
                .Where(m => m.HallId == id)
                .Where(m => m.MovieStart == moment)
                .Include(m => m.Movie)
                .FirstOrDefault();
        }

        public Entities.Movie? GetMovieById(int id)
        {
            return _dbContext
                .Movies
                .Where(m => m.Id == id)
                .FirstOrDefault();
        }

        public void InsertScreening(Entities.Screening screening)
        {
            _dbContext.Screenings.Add(screening);
            _dbContext.SaveChanges();
        }

        public bool UpdateMovieStartTime(int id, DateTime moment)
        {
            var screening = _dbContext
                .Screenings
                .Where(m => m.Id == id)
                .FirstOrDefault();

            if (screening == null) return false;

            screening.MovieStart = moment;
            _dbContext.SaveChanges();

            return true;
        }

        public bool DeleteScreening(int id)
        {
            var screening = _dbContext
                .Screenings
                .Where(m => m.Id == id)
                .FirstOrDefault();

            if (screening == null) return false;

            _dbContext.Screenings.Remove(screening);
            _dbContext.SaveChanges();

            return true;
        }

        public bool DeleteMovie(int id)
        {
            var movie = _dbContext
                .Movies
                .Where(m => m.Id == id)
                .FirstOrDefault();

            if (movie == null) return false;

            _dbContext.Movies.Remove(movie);
            _dbContext.SaveChanges();

            return true;
        }
    }
}

