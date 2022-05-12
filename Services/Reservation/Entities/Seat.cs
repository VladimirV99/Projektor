namespace Reservation.Entities
{
    public class Seat
    {
        public int HallId { get; set; }
        public int Row { get; set; }
        public int Column { get; set; }
        public float Coeff { get; set; }
    }
}
