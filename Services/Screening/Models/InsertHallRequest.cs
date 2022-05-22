using System.ComponentModel.DataAnnotations;
using Screening.Constants;

namespace Screening.Models
{
    public class InsertHallRequest
    {
        [Required(ErrorMessage = ErrorMessages.HALL_ID_REQUIRED)]
        public int Id { get; set; }
        [Required(ErrorMessage = ErrorMessages.HALL_NAME_REQUIRED)]
        public string Name { get; set; }
    }
}
