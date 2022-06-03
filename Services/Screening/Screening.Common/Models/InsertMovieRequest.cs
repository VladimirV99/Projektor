using System.ComponentModel.DataAnnotations;
using Screening.Common.Constants;

namespace Screening.Common.Models
{
    public class InsertMovieRequest
    {
        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int Id { get; set; }

        [Required(ErrorMessage = ErrorMessages.TITLE_REQUIRED)]
        public string Title { get; set; } = null!;

        [Required(ErrorMessage = ErrorMessages.LENGTH_REQUIRED)]
        public int Length { get; set; }
    }
}
