namespace Reservation.Models
{
    public class ReservationModel
    {
        public int Id { get; set; }
        public ScreeningModel Screening { get; set; }
        public MovieModel Movie { get; set; }
        public IEnumerable<SeatCoordinates> Seats { get; set; }
        public UserModel User { get; set; }
        public double Price { get; set; }
    }
}