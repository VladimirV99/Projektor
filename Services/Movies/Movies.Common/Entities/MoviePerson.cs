using System.ComponentModel.DataAnnotations;
using Movies.Common.Constants;

namespace Movies.Common.Entities
{
    public class MoviePerson
    {
        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int MovieId { get; set; }
        public Movie Movie { get; set; }

        [Required(ErrorMessage = ErrorMessages.ROLE_ID_REQUIRED)]
        public int RoleId { get; set; }
        public Role Role { get; set; }

        [Required(ErrorMessage = ErrorMessages.PERSON_ID_REQUIRED)]
        public int PersonId { get; set; }
        public Person Person { get; set; }
    }
}
