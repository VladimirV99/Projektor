using Review.Constants;
using System.ComponentModel.DataAnnotations;

namespace Review.Models
{
    public class CreateReviewRequest
    {
        [Required(ErrorMessage = ErrorMessages.SUMMARY_REQUIRED)]
        [MaxLength(Settings.SUMMARY_MAX_LENGTH, ErrorMessage = ErrorMessages.SUMMARY_MAX_LENGTH)]
        public string Summary { get; set; } = null!;

        [Required(ErrorMessage = ErrorMessages.BODY_REQUIRED)]
        [MaxLength(Settings.BODY_MAX_LENGTH, ErrorMessage = ErrorMessages.BODY_MAX_LENGTH)]
        public string Body { get; set; } = null!;

        [Required(ErrorMessage = ErrorMessages.SCORE_REQUIRED)]
        [Range(0, Settings.SCORE_MAX, ErrorMessage = ErrorMessages.SCORE_RANGE)]
        public int Score { get; set; }

        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int MovieId { get; set; }
    }
}
