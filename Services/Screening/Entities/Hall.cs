using System.ComponentModel.DataAnnotations;
using Screening.Constants;

namespace Screening.Entities
{
	public class Hall
	{
		[Required(ErrorMessage = ErrorMessages.ID_REQUIRED)]
		public int Id { get; set; }

		public string? Name { get; set; }

    }
}
