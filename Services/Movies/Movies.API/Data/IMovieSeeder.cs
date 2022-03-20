using System;
namespace Movies.API.Data
{
	public interface IMovieSeeder
	{
		public void SeedData(MovieContext context);
	}
}

