namespace Review.Entities
{
    public class MovieReview
    {
        public User Reviewer { get; set; } = null!;
        public string ReviewerId { get; set; } = null!;
        public int MovieId { get; set; }
        public string Summary { get; set; } = null!;
        public string Body { get; set; } = null!;
        public int Score { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
