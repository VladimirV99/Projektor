using Identity.Entities;
using Identity.Models;

namespace Identity.Services
{
    public interface IAuthenticationService
    {
        Task<User?> ValidateUser(UserCredentials userCredentials);
        Task<AuthenticationResponse> CreateAuthenticationResponse(User user);
    }
}
