using System;

namespace Movies.API.Models
{
	public class MovieModel
	{
        public int Id { get; set; }

        public string Title { get; set; }

        public int Length { get; set; }

        public uint Year { get; set; }

        public string? TrailerUrl { get; set; }

        public string? ImageUrl { get; set; }
        public string? ImdbUrl { get; set; }
        public List<PersonRoleModel> People { get; set; }
        public List<GenreModel> Genres { get; set; }
    }
}

