using System.ComponentModel.DataAnnotations;
using Review.Constants;

namespace Review.Models
{
    public class ReviewIdRequest
    {
        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int MovieId { get; set; }

        [Required(ErrorMessage = ErrorMessages.USER_ID_REQUIRED)]
        public string ReviewerId { get; set; } = null!;
    }
}