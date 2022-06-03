using System.ComponentModel.DataAnnotations;
using Reservation.Constants;

namespace Reservation.Models
{
    public class CreateSeatRequest
    {
        [Required(ErrorMessage = ErrorMessages.HALL_ID_REQUIRED)]
        public int HallId { get; set; }
        
        [Required(ErrorMessage = ErrorMessages.SEAT_ROW_REQUIRED)]
        [Range(Settings.HALL_ROWS_MIN, Settings.HALL_ROWS_MAX, ErrorMessage = ErrorMessages.SEAT_ROW_RANGE)]
        public int Row { get; set; }
        
        [Required(ErrorMessage = ErrorMessages.SEAT_COLUMN_REQUIRED)]
        [Range(Settings.HALL_COLUMNS_MIN, Settings.HALL_COLUMNS_MAX, ErrorMessage = ErrorMessages.SEAT_COLUMN_RANGE)]
        public int Column { get; set; }
        
        [Required(ErrorMessage = ErrorMessages.SEAT_PRICE_REQUIRED)]
        [Range(Settings.SEAT_PRICE_MIN, Settings.SEAT_PRICE_MAX, ErrorMessage = ErrorMessages.SEAT_PRICE_RANGE)]
        public float PriceMultiplier { get; set; }
    }
}