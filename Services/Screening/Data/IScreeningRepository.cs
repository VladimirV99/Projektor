using Screening.Entities;

namespace Screening.Data
{
	public interface IScreeningRepository
	{
		public Task<Entities.Screening>GetScreeningById(int id);
		public Task<List<Entities.Screening>>GetScreenings();
		//public Task<List<Entities.Screening>> GetScreeingsForHall();
		//public Task<List<Entities.Screening>> GetScreeningsForMovieId();
		//Dodaj novi
		//Azuriraj vreme
		//Obrisi
		//Dohvatanje screening-a po sali u nekom momentu
	}
}
