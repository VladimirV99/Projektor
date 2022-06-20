using Common.EventBus.Models;

namespace Common.EventBus.Events
{
    public class AddWatchedMovieEvent
    {
        public int MovieId { get; set; }
        public User User { get; set; }
        public int ReservationId { get; set; }
        public DateTime WatchedOn { get; set; }

        public AddWatchedMovieEvent(int movieId, User user, int reservationId, DateTime watchedOn)
        {
            MovieId = movieId;
            User = user ?? throw new ArgumentNullException(nameof(user));
            ReservationId = reservationId;
            WatchedOn = watchedOn;
        }
    }
}