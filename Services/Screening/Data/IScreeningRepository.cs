using Screening.Entities;

namespace Screening.Data
{
	public interface IScreeningRepository
	{
		public Task<Entities.Screening?>GetScreeningById(int id);
        public Task<List<Entities.Screening>> GetScreenings();
		public Task<List<Entities.Screening>> GetScreeingsByHallId(int id);
		public Task<List<Entities.Screening>> GetScreeningsByMovieId(int id);

		public void DeleteScreening(int id);

		public void InsertScreening(int hallId, int movieId, DateTime movieStart);
		//Dodaj novi
		//Azuriraj vreme
		//Dohvatanje screening-a po sali u nekom momentu
	}
}
