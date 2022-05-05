using Screening.Entities;

namespace Screening.Models
{
    public class ScreeningModel
    {
        public int Id { get; set; }
        public Movie Movie { get; set; }
        public DateTime MovieStart { get; set; }
        public int HallId { get; set; }
    }
}
