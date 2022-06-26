using System.ComponentModel.DataAnnotations;
using Movies.Common.Constants;

namespace Movies.Common.Entities
{
    public class Genre
    {
        [Required(ErrorMessage = ErrorMessages.ID_REQUIRED)]
        public int Id { get; set; }

        [Required(ErrorMessage = ErrorMessages.NAME_REQUIRED)]
        public string Name { get; set; }

        public List<Movie> Movies { get; set; }
    }
}
