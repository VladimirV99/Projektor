using System.ComponentModel.DataAnnotations;
using Movies.Common.Constants;

namespace Movies.Common.Entities
{
    public class Movie
    {
        [Required(ErrorMessage = ErrorMessages.ID_REQUIRED)]
        public int Id { get; set; }

        [Required(ErrorMessage = ErrorMessages.TITLE_REQUIRED)]
        public string Title { get; set; }

        [Required(ErrorMessage = ErrorMessages.LENGTH_REQUIRED)]
        public int Length { get; set; }

        [Required(ErrorMessage = ErrorMessages.YEAR_REQUIRED)]
        public uint Year { get; set; }

        public string? TrailerUrl { get; set; }

        public string? ImageUrl { get; set; }
        public string? ImdbUrl { get; set; }
        public List<Genre> Genres { get; set; }
        public List<MoviePerson> People { get; set; }
    }
}
