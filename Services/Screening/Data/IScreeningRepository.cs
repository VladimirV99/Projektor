using Screening.Entities;

namespace Screening.Data
{
	public interface IScreeningRepository
	{
		Task<Entities.Screening?>GetScreeningById(int id);
        Task<IEnumerable<Entities.Screening>> GetScreenings();
		Task<IEnumerable<Entities.Screening>> GetScreeingsByHallId(int id);
		Task<IEnumerable<Entities.Screening>> GetScreeningsByMovieId(int id);
		Task<Entities.Screening?> GetScreeningByHallIdAtMoment(int id, DateTime start, DateTime end);
		Task<IEnumerable<Movie>> GetMovies();
		Task<IEnumerable<Movie>> GetMoviesBySearchString(string searchString);
		Task<Movie?> GetMovieById(int id);
		Task<Hall?> GetHallById(int id);
		Task<IEnumerable<Hall>> GetAllHalls();
		Task<IEnumerable<Hall>> GetHallsBySearchString(string searchString);
		Task InsertScreening(Entities.Screening screening);
		Task InsertMovie(Movie movie);
		Task InsertHall(Hall hall);
		Task<bool> UpdateMovieStartTime(int id, DateTime moment);
		Task<bool> DeleteScreening(int id);
		Task<bool> DeleteMovie(int id);
    }
}
