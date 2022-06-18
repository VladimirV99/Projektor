namespace Common.EventBus.Events
{
    public class ReservationEmailEvent
    {
        public class Seat
        {
            public int Row { get; set; }
            public int Column { get; set; }

            public Seat(int row, int column)
            {
                Row = row;
                Column = column;
            }
        }
        
        public string To { get; set; }
        public int ReservationNumber { get; set; }
        public string Movie { get; set; }
        public string Hall { get; set; }
        public Seat[] Seats { get; set; }
        public DateTime Time { get; set; }
        public double Price { get; set; }

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
