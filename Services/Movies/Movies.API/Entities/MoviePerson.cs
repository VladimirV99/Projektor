using System.ComponentModel.DataAnnotations;

namespace Movies.API.Entities
{
    public class MoviePerson
    {
        [Required(ErrorMessage = "MovieId is required.")]
        public int MovieId { get; set; }
        [Required(ErrorMessage = "RoleId is required.")]

        public int RoleId { get; set; }
        [Required(ErrorMessage = "PersonId is required.")]

        public int PersonId { get; set; }

    }
}
