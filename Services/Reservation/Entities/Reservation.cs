namespace Reservation.Entities
{
    public class Reservation
    {
        public int Id { get; set; }
        public User User { get; set; }
        public Seat Seat { get; set; }
        public Screening Screening { get; set; }
    }
}
