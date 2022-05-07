using Review.Constants;
using System.ComponentModel.DataAnnotations;

namespace Review.Models
{
    public class GetReviewsForMovieRequest
    {
        [Required(ErrorMessage = ErrorMessages.MOVIE_ID_REQUIRED)]
        public int MovieId { get; set; }

        public DateTime? CreatedAfter { get; set; }

        [Range(1, Settings.PAGE_SIZE_MAX, ErrorMessage = ErrorMessages.PAGE_SIZE_RANGE)]
        public int? PerPage { get; set; }
    }
}
