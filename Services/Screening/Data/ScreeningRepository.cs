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

        public void DeleteScreening(int id)
        {
            var screening = _dbContext
                .Screenings
                .Where(m => m.Id == id)
                .First();

            _dbContext.Screenings.Remove(screening);
            _dbContext.SaveChanges();
        }

        public void InsertScreening(Entities.Screening screening)
        {
            _dbContext.Screenings.Add(screening);
            _dbContext.SaveChanges();

        }

    }
}

