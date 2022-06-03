using System.ComponentModel.DataAnnotations;
using Reservation.Constants;

namespace Reservation.Models
{
    public class SeatIdRequest
    {
        [Required(ErrorMessage = ErrorMessages.HALL_ID_REQUIRED)]
        public int HallId { get; set; }
        
        [Required(ErrorMessage = ErrorMessages.SEAT_ROW_REQUIRED)]
        public int Row { get; set; }
        
        [Required(ErrorMessage = ErrorMessages.SEAT_COLUMN_REQUIRED)]
        public int Column { get; set; }   
    }
}