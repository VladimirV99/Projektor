namespace Reservation.Entities
{
    public class Reservation
    {
        public int Id { get; set; }
        public User User { get; set; }
        public Movie Movie { get; set; }
        public Screening Screening { get; set; }
        // public int HallId { get; set; }
        // public Hall Hall { get; set; }
        public IEnumerable<Seat> Seats { get; set; }
    }
}
