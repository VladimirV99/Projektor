namespace Common.EventBus.Events
{
    public class RemoveWatchedMovieEvent
    {
        public int MovieId { get; set; }
        public string UserId { get; set; }
        public int ReservationId { get; set; }

        public RemoveWatchedMovieEvent(int movieId, string userId, int reservationId)
        {
            MovieId = movieId;
            UserId = userId ?? throw new ArgumentNullException(nameof(userId));
            ReservationId = reservationId;
        }
    }
}