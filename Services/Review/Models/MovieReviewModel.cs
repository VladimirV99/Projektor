namespace Review.Models
{
    public class MovieReviewModel
    {
        public UserModel Reviewer { get; set; } = null!;
        public int MovieId { get; set; }
        public string Summary { get; set; } = null!;
        public string Body { get; set; } = null!;
        public int Score { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
