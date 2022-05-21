using System.ComponentModel.DataAnnotations;
using Screening.Constants;

namespace Screening.Models
{
    public class UpdateMovieStartTimeRequest
    {
        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int ScreeningId { get; set; }

        [Required(ErrorMessage = ErrorMessages.STARTING_MOMENT_REQUIRED)]
        public DateTime Moment { get; set; }

    }
}
