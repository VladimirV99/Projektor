namespace Reservation.Models
{
    public class GetScreeningResponse
    {
        public int Id { get; set; }
        public DateTime MovieStart { get; set; }
        public MovieModel Movie { get; set; }
        public int HallId { get; set; }
    }
}