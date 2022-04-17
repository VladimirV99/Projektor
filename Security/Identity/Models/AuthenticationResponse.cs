namespace Identity.Models
{
    public class AuthenticationResponse
    {
        public UserDetails User { get; set; }  
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
    }
}
