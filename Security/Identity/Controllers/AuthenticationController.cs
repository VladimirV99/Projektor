﻿using AutoMapper;
using Identity.Constants;
using Identity.Data;
using Identity.Models;
using Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Identity.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthenticationController : IdentityControllerBase
    {
        public AuthenticationController(ILogger<AuthenticationController> logger, IMapper mapper, IIdentityRepository repository, IAuthenticationService authService) 
            : base(logger, mapper, repository, authService)
        {
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterCustomer([FromBody] UserRegisterRequest userRegisterRequest)
        {
            return await RegisterUserWithRoles(userRegisterRequest, new string[] { Roles.CUSTOMER });
        }

        [HttpPost("[action]")]
        [ProducesResponseType(typeof(AuthenticationResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] UserCredentials userCredentials)
        {
            var user = await _authService.ValidateUser(userCredentials);
            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(await _authService.CreateAuthenticationResponse(user));
        }

        [HttpPost("[action]")]
        [ProducesResponseType(typeof(AuthenticationResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<AuthenticationResponse>> RefreshSession([FromBody] SessionRefreshRequest request)
        {
            var user = await _repository.GetUserByEmail(request.Email);
            if (user == null)
            {
                _logger.LogWarning($"Refreshing session failed: Unknown user {request.Email}");
                return Unauthorized();
            }

            var userTokens = await _repository.GetUserRefreshTokens(user);
            var refreshToken = userTokens.SingleOrDefault(t => t.Token == request.RefreshToken);
            
            if (refreshToken == null)
            {
                _logger.LogWarning($"Refreshing session failed: Refresh token not found");
                return Unauthorized();
            }

            if (refreshToken.UserId != user.Id)
            {
                _logger.LogWarning($"Refreshing token failed: Refresh token does not belong to user");
                return Unauthorized();
            }

            if (refreshToken.ExpiresAt < DateTime.UtcNow)
            {
                _logger.LogWarning($"Refreshing token failed: Refresh token is invalid");
                return Unauthorized();
            }

            // If the token was previously revoked then we consider it stolen and invalidate the entire family
            if (refreshToken.IsRevoked)
            {
                _logger.LogWarning($"Atempted to use revoked token for {user.Email}. Revoking entire family");

                var latestToken = userTokens.Where(t => t.Family == refreshToken.Family).OrderByDescending(t => t.CreatedAt).First();
                
                if (!latestToken.IsRevoked)
                {
                    latestToken.IsRevoked = true;
                    await _repository.UpdateRefreshToken(latestToken);
                }

                return Unauthorized();
            }

            // Revoke the current token
            refreshToken.IsRevoked = true;
            await _repository.UpdateRefreshToken(refreshToken);

            // Remove expired tokens for user
            await _authService.RemoveOldRefreshTokens(user);

            // Create new access and refresh token
            var model = await _authService.CreateAuthenticationResponse(user, refreshToken);
            return Ok(model);
        }

        [Authorize]
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Logout([FromBody] UserLogoutRequest request)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _repository.GetUserByEmail(email);
            if (user == null)
            {
                _logger.LogWarning($"Logout failed: Unknown user {email}");
                return Unauthorized();
            }

            // Remove all tokens from the same family
            await _authService.RemoveRefreshTokenFamily(request.RefreshToken);
            
            // Remove other expired token
            await _authService.RemoveOldRefreshTokens(user);

            return Ok();
        }

        [Authorize]
        [HttpGet("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public Task<IActionResult> Test()
        {
            return Task.FromResult<IActionResult>(Ok());
        }
    }
}