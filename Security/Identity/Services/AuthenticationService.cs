using Identity.Data;
using Identity.Entities;
using Identity.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Identity.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IConfiguration _configuration;
        protected readonly IIdentityRepository _repository;

        public AuthenticationService(IConfiguration configuration, IIdentityRepository repository)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<User?> ValidateUser(UserCredentials userCredentials)
        {
            var user = await _repository.GetUserByEmail(userCredentials.Email);
            if (user == null || !await _repository.CheckUserPassword(user, userCredentials.Password))
            {
                return null;
            }
            return user;
        }

        public async Task<AuthenticationResponse> CreateAuthenticationResponse(User user, RefreshToken? parentToken = null)
        {
            var accessToken = await CreateAccessToken(user);
            var refreshToken = await CreateRefreshToken(user, parentToken);

            return new AuthenticationResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token
            };
        }

        private async Task<string> CreateAccessToken(User user)
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims(user);

            var jwtSettings = _configuration.GetSection("JWT");
            var token = new JwtSecurityToken
            (
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["Expires"])),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JWT:Key"));
            var secret = new SymmetricSecurityKey(key);

            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        private async Task<IEnumerable<Claim>> GetClaims(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var roles = await _repository.GetUserRoles(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }

        private async Task<RefreshToken> CreateRefreshToken(User user, RefreshToken? parent)
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            var tokenString = Convert.ToBase64String(randomNumber);

            var token = new RefreshToken
            {
                UserId = user.Id,
                Family = parent?.Family ?? tokenString,
                Token = tokenString,
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration.GetValue<string>("RefreshToken:Expires")))
            };

            await _repository.CreateRefreshToken(token);

            return token;
        }

        public Task<AuthenticationResponse> RefreshSession(User user, string refreshToken)
        {
            throw new NotImplementedException();
        }
    }
}
