using Review.Constants;
using System.ComponentModel.DataAnnotations;

namespace Review.Models
{
    public class WatchedMovieRequest
    {
        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int MovieId { get; set; }

        [Required(ErrorMessage = ErrorMessages.USER_ID_REQUIRED)]
        public string UserId { get; set; } = null!;

        [Required(ErrorMessage = ErrorMessages.RESERVATION_ID_REQUIRED)]
        public int ReservationId { get; set; }
    }
}
