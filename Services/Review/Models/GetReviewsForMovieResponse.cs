namespace Review.Models
{
    public class GetReviewsForMovieResponse
    {
        public long Count { get; set; }
        public IEnumerable<MovieReviewModel> Reviews { get; set; } = null!;
    }
}