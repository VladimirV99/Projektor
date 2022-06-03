using System.ComponentModel.DataAnnotations;
using Screening.Common.Constants;

namespace Screening.Common.Models
{
    public class InsertScreeningRequest
    {
        [Required(ErrorMessage = ErrorMessages.HALL_ID_REQUIRED)]
        public int HallId { get; set; }

        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int MovieId { get; set; }

        [Required(ErrorMessage = ErrorMessages.STARTING_MOMENT_REQUIRED)]
        public DateTime MovieStart { get; set; }
    }
}
