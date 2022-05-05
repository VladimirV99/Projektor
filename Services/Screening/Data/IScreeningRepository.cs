using Screening.Entities;

namespace Screening.Data
{
	public interface IScreeningRepository
	{
		public Task<Entities.Screening?>GetScreeningById(int id);
        public Task<List<Entities.Screening>> GetScreenings();
		public Task<List<Entities.Screening>> GetScreeingsByHallId(int id);
		public Task<List<Entities.Screening>> GetScreeningsByMovieId(int id);
		public Task<List<Entities.Screening>> GetScreeningByHallIdInSpecificMoment(int id, DateTime moment);
		public Task<Entities.Movie?> GetMovieById(int id);
		public Task InsertScreening(Entities.Screening screening);
		public Task<bool> UpdateMovieStartTime(int id, DateTime moment);
		public Task<bool> DeleteScreening(int id);
		public Task<bool> DeleteMovie(int id);
    }
}
