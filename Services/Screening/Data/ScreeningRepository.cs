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
    }
}

