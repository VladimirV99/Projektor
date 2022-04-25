using System.ComponentModel.DataAnnotations;
using Screening.Constants;

namespace Screening.Entities
{
	public class Seat
	{
		[Required(ErrorMessage = ErrorMessages.ID_REQUIRED)]
		public int Id { get; set; }

		[Required(ErrorMessage = ErrorMessages.COEFF_REQUIRED)]
		public float Coeff { get; set; }
	}
}
