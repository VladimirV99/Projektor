using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Reservation.Constants;

namespace Reservation.Models
{
    public class CreateReservationRequest
    {
        [Required(ErrorMessage = ErrorMessages.SCREENING_ID_REQUIRED)]
        public int ScreeningId { get; set; }
        
        [Required(ErrorMessage = ErrorMessages.RESERVATION_SEATS_REQUIRED)]
        [MinLength(1, ErrorMessage = ErrorMessages.RESERVATION_MIN_SEATS)]
        [MaxLength(10, ErrorMessage = ErrorMessages.RESERVATION_MAX_SEATS)]
        public IEnumerable<SeatCoordinates> Seats { get; set; }
    }
}