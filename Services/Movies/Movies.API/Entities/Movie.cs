using System.ComponentModel.DataAnnotations;

namespace Movies.API.Entities
{
    public class Movie
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Length is required.")]
        public int Length { get; set; }

        [Required(ErrorMessage = "Year is required.")]
        public uint Year { get; set; }

        public string? TrailerUrl { get; set; }

        public string? ImageUrl { get; set; }
        public string? ImdbUrl { get; set; }
        public List<Genre> Genres { get; set; }
        public List<MoviePerson> People { get; set; }
    }
}
