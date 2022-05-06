using Npgsql;

namespace Review.Data
{
    public interface IReviewContext
    {
        public NpgsqlConnection GetConnection();
    }
}
