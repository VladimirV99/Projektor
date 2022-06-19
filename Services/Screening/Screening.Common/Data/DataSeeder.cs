using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Polly;

namespace Screening.Common.Data
{
    public class DataSeeder : IDataSeeder
    {
        private readonly ScreeningContext _dbContext;
        private readonly ILogger<DataSeeder> _logger;

        public DataSeeder(ScreeningContext dbContext, ILogger<DataSeeder> logger)
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
                    .Handle<SqlException>()
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
            // Run migrations
            _dbContext.Database.Migrate();

            _logger.LogInformation("Finished seeding data");
        }
    }
}
