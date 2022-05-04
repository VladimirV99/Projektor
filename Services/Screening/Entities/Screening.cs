using Screening.Constants;
using System.ComponentModel.DataAnnotations;

namespace Screening.Entities
{
    public class Screening
	{
		[Required(ErrorMessage = ErrorMessages.ID_REQUIRED)]
		public int Id { get; set; }
		public Movie Movie { get; set; }
		public DateTime MovieStart { get; set; }
		public int HallId { get; set; }
	}
}

