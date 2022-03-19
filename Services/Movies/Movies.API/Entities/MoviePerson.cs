using System.ComponentModel.DataAnnotations;

namespace Movies.API.Entities
{
    public class MoviePerson
    {
        [Required(ErrorMessage = "MovieId is required.")]
        public int MovieId { get; set; }
        public Movie? Movie { get; set; }

        [Required(ErrorMessage = "RoleId is required")]
        public int RoleId { get; set; }
        public Role? Role { get; set; }

        [Required(ErrorMessage = "PersonId is required.")]
        public int PersonId { get; set; }
        public Person? Person { get; set; }

    }
}
