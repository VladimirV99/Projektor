﻿namespace Identity.Models
{
    public class AuthenticationResponse
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
    }
}
