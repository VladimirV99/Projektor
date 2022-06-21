namespace Common.EventBus.Events
{
    public class CancelScreeningEmailEvent
    {
        public string To { get; }
        public int ReservationNumber { get; }
        public string Movie { get; }
        public DateTime Time { get; }

        public CancelScreeningEmailEvent(string to, int reservationNumber, string movie, DateTime time)
        {
            To = to ?? throw new ArgumentNullException(nameof(to));
            ReservationNumber = reservationNumber;
            Movie = movie ?? throw new ArgumentNullException(nameof(movie));
            Time = time;
        }
    }
}