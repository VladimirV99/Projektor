using Dapper;
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
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(
                "INSERT INTO WatchedMovies (MovieId, UserId, WatchedOn) VALUES (@MovieId, @UserId, @WatchedOn)",
                watchedMovie
            );
            return watchedMovie;
        }

        public async Task<bool> HasWatchedMovie(string userId, int movieId)
        {
            using var connection = _dbContext.GetConnection();
            var watchedMovie = await connection.QuerySingleOrDefaultAsync<WatchedMovie>(
                "SELECT * FROM WatchedMovies WHERE MovieId = @MovieId AND UserId = @UserId",
                new { MovieId = movieId, UserId = userId }
            );
            return watchedMovie != null;
        }

        public async Task<bool> RemoveWatchedMovie(int movieId, string userId)
        {
            using var connection = _dbContext.GetConnection();
            var rowsAffected = await connection.ExecuteAsync(
                "DELETE FROM WatchedMovies WHERE MovieId = @MovieId AND UserId = @UserId",
                new { MovieId = movieId, UserId = userId }
            );
            return rowsAffected != 0;
        }

        public async Task<MovieReview?> CreateReview(MovieReview movieReview)
        {
            using var connection = _dbContext.GetConnection();
            var rowsAffected = await connection.ExecuteAsync(
                "INSERT INTO Reviews (ReviewerId, MovieId, Summary, Body, Score) VALUES (@ReviewerId, @MovieId, @Summary, @Body, @Score)",
                movieReview
            );
            if (rowsAffected == 0)
            {
                return null;
            }
            var review = await connection.QueryAsync<MovieReview, User, MovieReview>(
                "SELECT * FROM Reviews INNER JOIN Users ON Users.Id = Reviews.ReviewerId WHERE MovieId = @MovieId AND ReviewerId = @ReviewerId",
                (review, user) => { review.Reviewer = user; return review; },
                new { MovieId = movieReview.MovieId, ReviewerId = movieReview.ReviewerId }
            );
            return review.SingleOrDefault();
        }

        public async Task<MovieReview?> GetReview(int movieId, string reviewerId)
        {
            using var connection = _dbContext.GetConnection();
            var review = await connection.QueryAsync<MovieReview, User, MovieReview>(
                "SELECT * FROM Reviews INNER JOIN Users ON Users.Id = Reviews.ReviewerId WHERE MovieId = @MovieId AND ReviewerId = @ReviewerId",
                (review, user) => { review.Reviewer = user; return review; },
                new { MovieId = movieId, ReviewerId = reviewerId }
            );
            return review.SingleOrDefault();
        }

        public async Task<IEnumerable<MovieReview>> GetReviewsForMovie(int movieId, DateTime? createdAfter, int perPage = Settings.PAGE_SIZE_DEFAULT)
        {
            using var connection = _dbContext.GetConnection();
            var reviews = await connection.QueryAsync<MovieReview, User, MovieReview>(
                "SELECT * FROM Reviews LEFT JOIN Users ON Users.Id = Reviews.ReviewerId " +
                "WHERE MovieId = @MovieId " + (createdAfter == null? "" : "AND CreatedOn >= @CreatedAfter ") + 
                "ORDER BY CreatedOn LIMIT @PageSize",
                (review, user) =>
                {
                    review.Reviewer = user;
                    return review;
                },
                new { MovieId = movieId, CreatedAfter = createdAfter, PageSize = perPage }
            );
            return reviews;
        }

        public async Task UpdateReview(MovieReview review)
        {
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(
                "UPDATE Reviews SET Summary = @Summary, Body = @Body, Score = @Score WHERE MovieId = @MovieId AND ReviewerId = @ReviewerId",
                review
            );
        }

        public async Task<bool> DeleteReview(int movieId, string reviewerId)
        {
            using var connection = _dbContext.GetConnection();
            var rowsAffected = await connection.ExecuteAsync(
                "DELETE FROM Reviews WHERE MovieId = @MovieId AND ReviewerId = @ReviewerId",
                new { MovieId = movieId, ReviewerId = reviewerId }
            );
            return rowsAffected != 0;
        }

        public async Task CreateUser(User user)
        {
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(
                "INSERT INTO Users (Id, Email, FirstName, LastName) VALUES (@Id, @Email, @FirstName, @LastName)",
                user
            );
        }

        public async Task<User?> GetUserById(string id)
        {
            using var connection = _dbContext.GetConnection();
            var user = await connection.QuerySingleOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Id = @Id",
                new { Id = id }
            );
            return user;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            using var connection = _dbContext.GetConnection();
            var user = await connection.QuerySingleOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Email = @Email",
                new { Email = email }
            );
            return user;
        }
    }
}
