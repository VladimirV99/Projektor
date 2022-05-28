using System.ComponentModel.DataAnnotations;
using Reservation.Constants;

namespace Reservation.Models
{
    public class CreateHallRequest
    {
        [Required(ErrorMessage = ErrorMessages.HALL_ID_REQUIRED)]
        public string Name { get; set; } = null!;
        
        [Required(ErrorMessage = ErrorMessages.HALL_ROWS_REQUIRED)]
        [Range(Settings.HALL_ROWS_MIN, Settings.HALL_ROWS_MAX, ErrorMessage = ErrorMessages.HALL_ROWS_RANGE)]
        public int Rows { get; set; }
        
        [Required(ErrorMessage = ErrorMessages.HALL_COLUMNS_REQUIRED)]
        [Range(Settings.HALL_COLUMNS_MIN, Settings.HALL_COLUMNS_MAX, ErrorMessage = ErrorMessages.HALL_COLUMNS_RANGE)]
        public int Columns { get; set; }
    }
}