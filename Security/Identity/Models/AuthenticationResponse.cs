using Identity.Entities;

namespace Identity.Models
{
    public class AuthenticationResponse
    {
        public User User { get; set; }  
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
