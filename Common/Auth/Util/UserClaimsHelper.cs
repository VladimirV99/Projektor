using System.Security.Claims;
using Common.Auth.Models;

namespace Common.Auth.Util
{
    public static class UserClaimsHelper
    {
        public static UserInfo GetUserFromClaims(ClaimsPrincipal claims)
        {
            return new UserInfo(
                claims.FindFirstValue(ClaimTypes.NameIdentifier),
                claims.FindFirstValue(ClaimTypes.Email),
                claims.FindFirstValue(ClaimTypes.GivenName),
                claims.FindFirstValue(ClaimTypes.Surname)
            );
        }

        public static string? GetIdFromClaims(ClaimsPrincipal claims)
        {
            return claims.FindFirstValue(ClaimTypes.NameIdentifier);
        }
        
        public static string? GetEmailFromClaims(ClaimsPrincipal claims)
        {
            return claims.FindFirstValue(ClaimTypes.Email);
        }
        
        public static string? GetFirstNameFromClaims(ClaimsPrincipal claims)
        {
            return claims.FindFirstValue(ClaimTypes.GivenName);
        }
        
        public static string? GetLastNameFromClaims(ClaimsPrincipal claims)
        {
            return claims.FindFirstValue(ClaimTypes.Surname);
        }
    }
}