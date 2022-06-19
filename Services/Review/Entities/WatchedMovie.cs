namespace Review.Entities
{
    public class WatchedMovie
    {
        public int MovieId { get; set; }
        public string UserId { get; set; } = null!;
        public int ReservationId { get; set; }
        public DateTime WatchedOn { get; set; }
    }
}
