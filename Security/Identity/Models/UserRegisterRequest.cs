using Identity.Constants;
using System.ComponentModel.DataAnnotations;

namespace Identity.Models
{
    public class UserRegisterRequest
    {
        [Required(ErrorMessage = ErrorMessages.FIRST_NAME_REQUIRED)]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = ErrorMessages.LAST_NAME_REQUIRED)]
        public string LastName { get; set; } = null!;

        [EmailAddress(ErrorMessage = ErrorMessages.EMAIL_INVALID)]
        [Required(ErrorMessage = ErrorMessages.EMAIL_REQUIRED)]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = ErrorMessages.PASSWORD_REQUIRED)]
        public string Password { get; set; } = null!;
    }
}
