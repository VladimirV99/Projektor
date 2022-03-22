using Identity.Constants;
using System.ComponentModel.DataAnnotations;

namespace Identity.Models
{
    public class SessionRefreshRequest
    {
        [EmailAddress(ErrorMessage = ErrorMessages.EMAIL_INVALID)]
        [Required(ErrorMessage = ErrorMessages.EMAIL_REQUIRED)]
        public string Email { get; set; }

        [Required(ErrorMessage = ErrorMessages.REFRESH_TOKEN_REQUIRED)]
        public string RefreshToken { get; set; }
    }
}
