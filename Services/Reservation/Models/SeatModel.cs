namespace Reservation.Models
{
    public class SeatModel
    {
        public int HallId { get; set; }
        public int Row { get; set; }
        public int Column { get; set; }
        public float PriceMultiplier { get; set; }
    }
}