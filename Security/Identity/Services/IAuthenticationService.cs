using Identity.Entities;
using Identity.Models;

namespace Identity.Services
{
    public interface IAuthenticationService
    {
        Task<User?> ValidateUser(UserCredentials userCredentials);
        Task<AuthenticationResponse> CreateAuthenticationResponse(User user, RefreshToken? parentToken = null);
        Task<AuthenticationResponse> RefreshSession(User user, string refreshToken);
    }
}
