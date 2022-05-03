using Microsoft.EntityFrameworkCore;
using Review.Constants;
using Review.Data;
using Review.Entities;

namespace Review.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ReviewContext _dbContext;

        public ReviewRepository(ReviewContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<WatchedMovie> AddWatchedMovie(WatchedMovie watchedMovie)
        {
            _dbContext.WatchedMovies.Add(watchedMovie);
            await _dbContext.SaveChangesAsync();
            return watchedMovie;
        }

        public async Task<bool> HasWatchedMovie(string userId, int movieId)
        {
            return (await _dbContext.WatchedMovies.FindAsync(movieId, userId)) != null;
        }

        public async Task RemoveWatchedMovie(WatchedMovie watchedMovie)
        {
            _dbContext.WatchedMovies.Remove(watchedMovie);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<MovieReview> CreateReview(MovieReview movieReview)
        {
            _dbContext.Reviews.Add(movieReview);
            await _dbContext.SaveChangesAsync();
            return movieReview;
        }

        public async Task<MovieReview?> GetReview(int movieId, string reviewerId)
        {
            return await _dbContext.Reviews
                .Where(r => r.MovieId == movieId && r.ReviewerId == reviewerId)
                .Include(r => r.Reviewer)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MovieReview>> GetReviewsForMovie(int movieId, DateTime? createdAfter, int perPage = Settings.PAGE_SIZE_DEFAULT)
        {
            var reviews = await _dbContext.Reviews
                .Where(r => r.MovieId == movieId)
                .Where(r => createdAfter == null || r.CreatedOn > createdAfter)
                .OrderBy(r => r.CreatedOn)
                .Take(perPage)
                .Include(r => r.Reviewer)
                .ToListAsync();
            return reviews;
        }

        public async Task UpdateReview(MovieReview review)
        {
            _dbContext.Reviews.Update(review);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteReview(MovieReview review)
        {
            _dbContext.Reviews.Remove(review);
            await _dbContext.SaveChangesAsync();
        }

        public async Task CreateUser(User user)
        {
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<User?> GetUserById(string id)
        {
            return await _dbContext.Users.FindAsync(id);
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _dbContext.Users.SingleOrDefaultAsync(u => u.Email == email);
        }
    }
}
