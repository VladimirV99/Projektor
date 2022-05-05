using Npgsql;

namespace Review.Data
{
    public class ReviewContext : IReviewContext
    {
        private readonly IConfiguration _configuration;

        public ReviewContext(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public NpgsqlConnection GetConnection()
        {
            return new NpgsqlConnection(_configuration.GetConnectionString("ReviewConnectionString"));
        }
    }
}
