namespace Review.Entities
{
    public class WatchedMovie
    {
        public int MovieId { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime WatchedOn { get; set; }
    }
}
