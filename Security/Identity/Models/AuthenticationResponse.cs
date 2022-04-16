namespace Identity.Models
{
    public class AuthenticationResponse
    {
        public UserDetails User { get; set; }  
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
