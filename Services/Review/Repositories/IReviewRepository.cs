using Review.Constants;
using Review.Entities;

namespace Review.Repositories
{
    public interface IReviewRepository
    {
        Task<WatchedMovie> AddWatchedMovie(WatchedMovie watchedMovie);
        Task<bool> HasWatchedMovie(string userId, int movieId);
        Task RemoveWatchedMovie(WatchedMovie watchedMovie);
        Task<MovieReview> CreateReview(MovieReview review);
        Task<MovieReview?> GetReview(int movieId, string reviewerId);
        Task<IEnumerable<MovieReview>> GetReviewsForMovie(int movieId, DateTime? createdAfter, int perPage = Settings.PAGE_SIZE_DEFAULT);
        Task UpdateReview(MovieReview review);
        Task DeleteReview(MovieReview review);
        Task CreateUser(User user);
        Task<User?> GetUserById(string id);
        Task<User?> GetUserByEmail(string email);
    }
}
