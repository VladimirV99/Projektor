using System.ComponentModel.DataAnnotations;
using Screening.Common.Constants;

namespace Screening.Common.Models
{
    public class GetScreeningsByHallIdAtTimeRequest
    {
        [Required(ErrorMessage = ErrorMessages.HALL_ID_REQUIRED)]
        public int HallId { get; set; }
        [Required(ErrorMessage = ErrorMessages.STARTING_MOMENT_REQUIRED)]
        public DateTime Start { get; set; }
        [Required(ErrorMessage = ErrorMessages.ENDING_MOMENT_REQUIRED)]
        public DateTime End { get; set; }

    }
}
