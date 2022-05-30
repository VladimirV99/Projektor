using Review.Constants;
using Review.Entities;

namespace Review.Repositories
{
    public interface IReviewRepository
    {
        Task<WatchedMovie> AddWatchedMovie(WatchedMovie watchedMovie);
        Task<bool> HasWatchedMovie(string userId, int movieId);
        Task<bool> RemoveWatchedMovie(int movieId, string userId);
        Task<MovieReview?> CreateReview(MovieReview review);
        Task<MovieReview?> GetReview(int movieId, string reviewerId);
        Task<IEnumerable<MovieReview>> GetReviewsForMovie(int movieId, DateTime? createdAfter, int perPage = Settings.PAGE_SIZE_DEFAULT);
        Task<long> CountReviewsForMovie(int movieId);
        Task UpdateReview(MovieReview review);
        Task<bool> DeleteReview(int movieId, string reviewerId);
        Task CreateUser(User user);
        Task<User?> GetUserById(string id);
        Task<User?> GetUserByEmail(string email);
    }
}
