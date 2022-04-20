using Identity.Constants;
using System.ComponentModel.DataAnnotations;

namespace Identity.Models
{
    public class UserChangeNameRequest
    {
        [Required(ErrorMessage = ErrorMessages.FIRST_NAME_REQUIRED)]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = ErrorMessages.LAST_NAME_REQUIRED)]
        public string LastName { get; set; } = null!;
    }
}
