using Screening.Models;

namespace Screening.Models
{
    public class ScreeningModel
    {
        public int Id { get; set; }
        public MovieModel Movie { get; set; }
        public DateTime MovieStart { get; set; }
        public int HallId { get; set; }
    }
}
