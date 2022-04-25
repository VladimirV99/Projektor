using System.ComponentModel.DataAnnotations;
using Screening.Constants;

namespace Screening.Entities
{
	public class Movie
	{
        [Required(ErrorMessage = ErrorMessages.ID_REQUIRED)]
        public int Id { get; set; }

        [Required(ErrorMessage = ErrorMessages.TITLE_REQUIRED)]
        public string Title { get; set; }

        [Required(ErrorMessage = ErrorMessages.LENGTH_REQUIRED)]
        public int Length { get; set; }
    }
}