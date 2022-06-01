namespace Reservation.Models
{
    // TODO This should be removed when gRPC is implemented
    public class GetScreeningResponse
    {
        public int Id { get; set; }
        public DateTime MovieStart { get; set; }
        public MovieModel Movie { get; set; }
        public int HallId { get; set; }
    }
}