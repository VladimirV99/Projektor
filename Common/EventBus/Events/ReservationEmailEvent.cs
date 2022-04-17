namespace Common.EventBus.Events
{
    public class ReservationEmailEvent
    {
        public string To { get; set; } = null!;
        public string ReservationNumber { get; set; } = null!;
        public string Movie { get; set; } = null!;
        public string Hall { get; set; } = null!;
        public string Seat { get; set; } = null!;
        public DateTime Time { get; set; }
        public double Price { get; set; }

        public ReservationEmailEvent(string to, string reservationNumber, string movie, string hall, string seat, DateTime time, double price)
        {
            To = to ?? throw new ArgumentNullException(nameof(to));
            ReservationNumber = reservationNumber ?? throw new ArgumentNullException(nameof(reservationNumber));
            Movie = movie ?? throw new ArgumentNullException(nameof(movie));
            Hall = hall ?? throw new ArgumentNullException(nameof(hall));
            Seat = seat ?? throw new ArgumentNullException(nameof(seat));
            Time = time;
            Price = price;
        }
    }
}
