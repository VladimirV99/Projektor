namespace Screening.API.Models
{
    public class ScreeningModel
    {
        public int Id { get; set; }
        public MovieModel Movie { get; set; }
        public DateTime MovieStart { get; set; }
        public HallModel Hall { get; set; }
    }
}
