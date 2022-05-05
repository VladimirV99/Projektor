using Screening.Entities;

namespace Screening.Data
{
	public interface IScreeningRepository
	{
		public Task<Entities.Screening?>GetScreeningById(int id);
        public Task<List<Entities.Screening>> GetScreenings();
		public Task<List<Entities.Screening>> GetScreeingsByHallId(int id);
		public Task<List<Entities.Screening>> GetScreeningsByMovieId(int id);
		public Entities.Screening? GetScreeningByHallIdInSpecificMoment(int id, DateTime moment);
		public bool UpdateMovieStartTime(int id, DateTime moment);
		public bool DeleteScreening(int id);
		public Entities.Movie? GetMovieById(int id);
		public bool DeleteMovie(int id);
        public void InsertScreening(Entities.Screening screening);
    }
}
