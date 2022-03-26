using Identity.Entities;
using Identity.Models;

namespace Identity.Services
{
    public interface IAuthenticationService
    {
        Task<User?> ValidateUser(UserCredentials userCredentials);
        Task<RefreshToken?> ValidateRefreshToken(User user, string refreshToken);
        Task<AuthenticationResponse> CreateAuthenticationResponse(User user, RefreshToken? parentToken = null);
        Task RemoveRefreshTokenFamily(string refreshToken);
        Task RemoveOldRefreshTokens(User user);
        Task RevokeAllTokens();
    }
}
