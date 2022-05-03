namespace Screening.Entities
{
    public class Screening
	{
        public Screening(Movie movie, DateTime movieStart, int hallId)
        {
            Movie = movie;
            MovieStart = movieStart;
            HallId = hallId;
        }

        public int Id { get; set; }
		public Movie Movie { get; set; }
		public DateTime MovieStart { get; set; }
		public int HallId { get; set; }
	}
}

