namespace Screening.Entities
{
    public class Screening
	{
		public int Id { get; set; }
		public Movie Movie { get; set; }
		public DateTime MovieStart { get; set; }
		public int HallId { get; set; }
	}
}
