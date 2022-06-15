using System.ComponentModel.DataAnnotations;
using Movies.Common.Constants;

namespace Movies.Common.Entities
{
    public class Person
    {
        [Required(ErrorMessage = ErrorMessages.ID_REQUIRED)]
        public int Id { get; set; }

        [Required(ErrorMessage = ErrorMessages.FIRST_NAME_REQUIRED)]
        public string FirstName { get; set; }

        [Required(ErrorMessage = ErrorMessages.LAST_NAME_REQUIRED)]
        public string LastName { get; set; }

        public string? ImageUrl { get; set; }

        public string? ImdbUrl { get; set; }

        public List<MoviePerson> Movies { get; set; }
    }
}
