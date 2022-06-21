namespace Common.EventBus.Events
{
    public class RemoveWatchedMovieEvent
    {
        public int MovieId { get; }
        public string UserId { get; }
        public int ReservationId { get; }

        public RemoveWatchedMovieEvent(int movieId, string userId, int reservationId)
        {
            MovieId = movieId;
            UserId = userId ?? throw new ArgumentNullException(nameof(userId));
            ReservationId = reservationId;
        }
    }
}