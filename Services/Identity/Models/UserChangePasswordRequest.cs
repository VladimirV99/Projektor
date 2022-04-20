using Identity.Constants;
using System.ComponentModel.DataAnnotations;

namespace Identity.Models
{
    public class UserChangePasswordRequest
    {
        [Required(ErrorMessage = ErrorMessages.PASSWORD_REQUIRED)]
        public string CurrentPassword { get; set; } = null!;

        [Required(ErrorMessage = ErrorMessages.NEW_PASSWORD_REQUIRED)]
        public string NewPassword { get; set; } = null!;
    }
}
