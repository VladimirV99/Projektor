using Identity.Constants;
using System.ComponentModel.DataAnnotations;

namespace Identity.Models
{
    public class UserLogoutRequest
    {
        [Required(ErrorMessage = ErrorMessages.REFRESH_TOKEN_REQUIRED)]
        public string RefreshToken { get; set; }
    }
}
