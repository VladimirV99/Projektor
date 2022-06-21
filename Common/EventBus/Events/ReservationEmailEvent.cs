namespace Common.EventBus.Events
{
    public class ReservationEmailEvent
    {
        public class Seat
        {
            public int Row { get; }
            public int Column { get; }

            public Seat(int row, int column)
            {
                Row = row;
                Column = column;
            }
        }
        
        public string To { get; }
        public int ReservationNumber { get; }
        public string Movie { get; }
        public string Hall { get; }
        public Seat[] Seats { get; }
        public DateTime Time { get; }
        public double Price { get; }

        public ReservationEmailEvent(string to, int reservationNumber, string movie, string hall,
            Seat[] seats, DateTime time, double price)
        {
            To = to ?? throw new ArgumentNullException(nameof(to));
            ReservationNumber = reservationNumber;
            Movie = movie ?? throw new ArgumentNullException(nameof(movie));
            Hall = hall ?? throw new ArgumentNullException(nameof(hall));
            Seats = seats ?? throw new ArgumentNullException(nameof(seats));
            Time = time;
            Price = price;
        }
    }
}
