﻿namespace Screening.Entities
{
    public class Screening
	{
		public int Id { get; set; }
		public int MovieId { get; set; }
		public Movie Movie { get; set; } = null!;
		public DateTime MovieStart { get; set; }
		public Hall Hall { get; set; }
	}
}

