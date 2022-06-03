using Movies.API.Entities;
using Movies.API.Models;

namespace Movies.API.Data
{
	public interface IMoviesRepository
	{
		public Task<Movie?> GetMovieById(int id);
		public Task<List<Movie>> GetMoviesByGenreId(int id);
		public Task<List<Movie>> GetMoviesByPerson(int id);
		public Task<Tuple<List<Movie>, int>> FilterMovies(FilterMoviesRequest request);
		public Task<List<Genre>> GetGenres();
		public Task<Genre?> GetGenreById(int id);
		public Task<Person?> GetPersonById(int id);
		public Task<Role?> GetRoleById(int id);
		public Task<Tuple<uint, uint, int, int>> GetFilterLimits();
		public Task CreateMovie(Movie movie);
		public Task UpdateMovie(Movie movie);
		public Task DeleteMovie(int id);
		public Task<List<Person>> SearchPeople(string searchString);
		public Task<List<Role>> SearchRoles(string searchString);
		public Task<List<Role>> GetRoles();
		public Task<Tuple<List<Person>, int>> SearchPeopleAdmin(string searchString, int page);
		public Task CreatePerson(Person person);
		public Task UpdatePerson(Person person);
		public Task DeletePerson(int id);
	}
}

