using Common.EventBus.Models;

namespace Common.EventBus.Events
{
    public class AddWatchedMovieEvent
    {
        public int MovieId { get; }
        public User User { get; }
        public int ReservationId { get; }
        public DateTime WatchedOn { get; }

        public AddWatchedMovieEvent(int movieId, User user, int reservationId, DateTime watchedOn)
        {
            MovieId = movieId;
            User = user ?? throw new ArgumentNullException(nameof(user));
            ReservationId = reservationId;
            WatchedOn = watchedOn;
        }
    }
}