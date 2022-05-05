using Screening.Entities;

namespace Screening.Data
{
	public interface IScreeningRepository
	{
		public Task<Entities.Screening?>GetScreeningById(int id);
        public Task<IEnumerable<Entities.Screening>> GetScreenings();
		public Task<IEnumerable<Entities.Screening>> GetScreeingsByHallId(int id);
		public Task<IEnumerable<Entities.Screening>> GetScreeningsByMovieId(int id);
		public Task<Entities.Screening?> GetScreeningByHallIdAtMoment(int id, DateTime start, DateTime end);
		public Task<Entities.Movie?> GetMovieById(int id);
		public Task InsertScreening(Entities.Screening screening);
		public Task<bool> UpdateMovieStartTime(int id, DateTime moment);
		public Task<bool> DeleteScreening(int id);
		public Task<bool> DeleteMovie(int id);
    }
}
