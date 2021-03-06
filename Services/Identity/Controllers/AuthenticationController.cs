using AutoMapper;
using Common.Auth;
using Identity.Models;
using Identity.Repositories;
using Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Common.EventBus.Events;
using MassTransit;

namespace Identity.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthenticationController : IdentityControllerBase
    {
        private readonly IPublishEndpoint _publishEndpoint;

        public AuthenticationController(ILogger<AuthenticationController> logger, IMapper mapper,
            IIdentityRepository repository, IAuthenticationService authService, IPublishEndpoint publishEndpoint) :
            base(logger, mapper, repository, authService)
        {
            _publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterCustomer([FromBody] UserRegisterRequest userRegisterRequest)
        {
            var result = await RegisterUserWithRoles(userRegisterRequest, new string[] { Roles.CUSTOMER });

            await _publishEndpoint.Publish(new WelcomeEmailEvent(
                userRegisterRequest.Email,
                userRegisterRequest.FirstName,
                userRegisterRequest.LastName
            ));
            
            return result;
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
                _logger.LogWarning("Refreshing session failed: Unknown user '{Email}'", request.Email);
                return Unauthorized();
            }

            // Check if the refresh token is valid
            var refreshToken = await _authService.ValidateRefreshToken(user, request.RefreshToken);
            if (refreshToken == null)
            {
                return Unauthorized();
            }

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
                _logger.LogWarning("Logout failed: Unknown user '{Email}'", email);
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
