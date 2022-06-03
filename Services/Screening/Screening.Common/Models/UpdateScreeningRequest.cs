using System.ComponentModel.DataAnnotations;
using Screening.Common.Constants;

namespace Screening.Common.Models
{
    public class UpdateScreeningRequest
    {
        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int ScreeningId { get; set; }

        [Required(ErrorMessage = ErrorMessages.STARTING_MOMENT_REQUIRED)]
        public DateTime Moment { get; set; }

        [Required(ErrorMessage = ErrorMessages.HALL_ID_REQUIRED)]
        public int HallId { get; set; }

        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int MovieId { get; set; }

    }
}
