using AutoMapper;
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
        private readonly ILogger<AuthenticationService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IIdentityRepository _repository;
        private readonly IMapper _mapper;

        public AuthenticationService(ILogger<AuthenticationService> logger, IConfiguration configuration, IIdentityRepository repository, IMapper mapper)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
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

        public async Task<RefreshToken?> ValidateRefreshToken(User user, string refreshToken)
        {
            var userTokens = await _repository.GetUserRefreshTokens(user);
            var token = userTokens.SingleOrDefault(t => t.Token == refreshToken);

            if (token == null)
            {
                _logger.LogWarning($"Validating token failed: Refresh token not found");
                return null;
            }

            if (token.UserId != user.Id)
            {
                _logger.LogWarning($"Validating token failed: Refresh token does not belong to user");
                return null;
            }

            if (token.ExpiresAt < DateTime.UtcNow)
            {
                _logger.LogWarning($"Validating token failed: Refresh token is expired");
                return null;
            }

            // If the token was previously revoked then we consider it stolen and invalidate the entire family
            if (token.IsRevoked)
            {
                _logger.LogWarning($"Atempted to use revoked token for {user.Email}. Revoking entire family");

                var latestToken = userTokens.Where(t => t.Family == token.Family).OrderByDescending(t => t.CreatedAt).First();

                if (!latestToken.IsRevoked)
                {
                    latestToken.IsRevoked = true;
                    latestToken.RevokedAt = DateTime.UtcNow;
                    await _repository.UpdateRefreshToken(latestToken);
                }

                return null;
            }

            // Revoke the current token
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
            await _repository.UpdateRefreshToken(token);

            return token;
        }

        public async Task<AuthenticationResponse> CreateAuthenticationResponse(User user, RefreshToken? parentToken = null)
        {
            var accessToken = await CreateAccessToken(user);
            var refreshToken = await CreateRefreshToken(user, parentToken);

            return new AuthenticationResponse
            {
                User = _mapper.Map<UserDetails>(user),
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

        public async Task RemoveRefreshTokenFamily(string refreshToken)
        {
            var token = await _repository.FindRefreshToken(refreshToken);
            if (token == null)
            {
                return;
            }

            await _repository.DeleteRefreshTokens(t => t.Family == token.Family);
        }

        public async Task RemoveOldRefreshTokens(User user)
        {
            // Remove old inactive refresh tokens from user based on time to live setting
            var timeToLive = Convert.ToDouble(_configuration.GetValue<string>("RefreshToken:TimeToLive"));

            var expiredTokens = (await _repository.GetUserRefreshTokens(user))
                .Where(t => t.HasExceededTTL(timeToLive));
            await _repository.DeleteRefreshTokens(expiredTokens);
        }

        public async Task RevokeAllTokens()
        {
            await _repository.DeleteAllRefreshTokens();
        }
    }
}
