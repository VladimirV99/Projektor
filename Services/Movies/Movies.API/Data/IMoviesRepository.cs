using Movies.API.Entities;

namespace Movies.API.Data
{
	public interface IMoviesRepository
	{
		public Task<Movie?> GetMovieById(int id);
		public Task<Genre?> GetMoviesByGenreId(int id);
		public Task<List<Movie>> GetMoviesByPerson(int id);
	}
}

