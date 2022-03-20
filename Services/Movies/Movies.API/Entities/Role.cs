using System.ComponentModel.DataAnnotations;

namespace Movies.API.Entities
{
    public class Role
    {
        [Required(ErrorMessage = "Id name is required.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
