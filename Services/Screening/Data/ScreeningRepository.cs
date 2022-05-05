﻿using System;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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

        public async Task<List<Entities.Screening>> GetScreeningByHallIdInSpecificMoment(int id, DateTime moment)
        {
            return await _dbContext
                .Screenings
                .Where(m => m.HallId == id)
                .Where(m => m.MovieStart == moment)
                .Include(m => m.Movie)
                .ToListAsync();
        }

        public async Task<Entities.Movie?> GetMovieById(int id)
        {
            return await _dbContext
                .Movies
                .FindAsync(id);
        }

        public async Task InsertScreening(Entities.Screening screening)
        {
            await _dbContext.Screenings.AddAsync(screening);
            _dbContext.SaveChanges();
        }

        public async Task<bool> UpdateMovieStartTime(int id, DateTime moment)
        {
            var screening = await _dbContext
                .Screenings
                .FindAsync(id);

            if (screening == null) return false;

            screening.MovieStart = moment;
            _dbContext.SaveChanges();

            return true;
        }

        public async Task<bool> DeleteScreening(int id)
        {
            var screening = await _dbContext
                .Screenings
                .FindAsync(id);

            if (screening == null) return false;

            _dbContext.Screenings.Remove(screening);
            _dbContext.SaveChanges();

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
    }
}

