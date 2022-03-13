using System.ComponentModel.DataAnnotations;

namespace Movies.API.Entities
{
    public class Genre
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }
        public List<Movie> Movies { get; set; }
    }
}
