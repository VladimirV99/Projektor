using System.ComponentModel.DataAnnotations;

namespace Movies.API.Entities
{
    public class Person
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }
        [Required(ErrorMessage = "First name is required.")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last name is required.")]
        public string LastName { get; set; }
        public string? ImageUrl { get; set; }
        public List<MoviePerson> Movies { get; set; }
    }
}
