using Identity.Constants;
using System.ComponentModel.DataAnnotations;

namespace Identity.Models
{
    public class UserCredentials
    {
        [EmailAddress(ErrorMessage = ErrorMessages.EMAIL_INVALID)]
        [Required(ErrorMessage = ErrorMessages.EMAIL_REQUIRED)]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = ErrorMessages.PASSWORD_REQUIRED)]
        public string Password { get; set; } = null!;
    }
}
