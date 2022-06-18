namespace Common.EventBus.Events
{
    public class CancelReservationEmailEvent
    {
        public string To { get; set; }
        public int ReservationNumber { get; set; }
        public string Movie { get; set; }
        public DateTime Time { get; set; }

        public CancelReservationEmailEvent(string to, int reservationNumber, string movie, DateTime time)
        {
            To = to ?? throw new ArgumentNullException(nameof(to));
            ReservationNumber = reservationNumber;
            Movie = movie ?? throw new ArgumentNullException(nameof(movie));
            Time = time;
        }
    }
}