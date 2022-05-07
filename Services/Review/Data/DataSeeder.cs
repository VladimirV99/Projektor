using Dapper;
using Npgsql;
using Polly;

namespace Review.Data
{
    public class DataSeeder : IDataSeeder
    {
        private readonly ReviewContext _dbContext;
        private readonly ILogger<DataSeeder> _logger;

        public DataSeeder(ReviewContext dbContext, ILogger<DataSeeder> logger)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public void Seed()
        {
            try
            {
                const int retryCount = 5;
                var retry = Policy
                    .Handle<NpgsqlException>()
                    .WaitAndRetry(
                        retryCount: retryCount,
                        sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                        onRetry: (exception, sleepDuration, retryNumber, context) =>
                        {
                            _logger.LogWarning("Retry {RetryNumber}/{RetryCount} to seed data", retryNumber, retryCount);
                        });
                retry.Execute(SeedFunction);
            }
            catch (Exception)
            {
                _logger.LogError("Could not seed data. All attempts failed");
            }
        }

        private void SeedFunction()
        {
            using var connection = _dbContext.GetConnection();

            const int DATABASE_VERSION = 3;

            var infoTableExists = connection.ExecuteScalar<bool>(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema LIKE 'public' AND table_type LIKE 'BASE TABLE' AND table_name = 'dbinfo')"
                // or "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'dbinfo'); "
            );
            var infoExists = false;
            var currentVersion = -1;
            if (infoTableExists)
            {
                infoExists = connection.ExecuteScalar<bool>("SELECT (SELECT COUNT(*) FROM DbInfo) > 0");
                if (infoExists)
                {
                    currentVersion = connection.ExecuteScalar<int>("SELECT Version FROM DbInfo WHERE (Id = (SELECT MAX(Id) FROM DbInfo))");
                }
            }

            if (!infoTableExists || !infoExists || currentVersion != DATABASE_VERSION)
            {
                _logger.LogInformation("Updating database");

                connection.Execute("CREATE TABLE IF NOT EXISTS DbInfo (Id SERIAL PRIMARY KEY, Version INT NOT NULL)");

                connection.Execute("DROP TABLE IF EXISTS WatchedMovies");
                connection.Execute("DROP TABLE IF EXISTS Reviews");
                connection.Execute("DROP TABLE IF EXISTS Users");

                connection.Execute(
                    "CREATE TABLE Users (Id VARCHAR(100) PRIMARY KEY NOT NULL, Email VARCHAR(100) NOT NULL UNIQUE, FirstName VARCHAR(100) NOT NULL, LastName VARCHAR(100) NOT NULL)"
                );

                connection.Execute(
                    "CREATE TABLE WatchedMovies (MovieId INT NOT NULL, UserId VARCHAR(100) NOT NULL, WatchedOn TIMESTAMP NOT NULL, PRIMARY KEY (MovieId, UserId))"
                );

                connection.Execute(
                    "CREATE TABLE Reviews (MovieId INT NOT NULL, ReviewerId VARCHAR(100) NOT NULL REFERENCES Users(Id), Summary VARCHAR(50) NOT NULL, Body TEXT NOT NULL, Score INT NOT NULL CHECK(Score >= 0 AND Score <= 10) , CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (MovieId, ReviewerId))"
                );

                connection.Execute("INSERT INTO DbInfo (Version) VALUES (@Version)", new { Version = DATABASE_VERSION });

                _logger.LogInformation("Database has been updated");
            }
            else
            {
                _logger.LogInformation("Database is up to date");
            }
        }
    }
}
