using Identity.Constants;
using System.ComponentModel.DataAnnotations;

namespace Identity.Models
{
    public class UserCredentials
    {
        [EmailAddress(ErrorMessage = ErrorMessages.EMAIL_INVALID)]
        [Required(ErrorMessage = ErrorMessages.EMAIL_REQUIRED)]
        public string Email { get; set; }

        [Required(ErrorMessage = ErrorMessages.PASSWORD_REQUIRED)]
        public string Password { get; set; }
    }
}
