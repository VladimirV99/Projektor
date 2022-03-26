using AutoMapper;
using Identity.Constants;
using Identity.Data;
using Identity.Entities;
using Identity.Models;
using Identity.Services;
using Microsoft.AspNetCore.Mvc;

namespace Identity.Controllers
{
    public class IdentityControllerBase : ControllerBase
    {
        protected readonly ILogger<AuthenticationController> _logger;
        protected readonly IMapper _mapper;
        protected readonly IIdentityRepository _repository;
        protected readonly IAuthenticationService _authService;

        public IdentityControllerBase(ILogger<AuthenticationController> logger, IMapper mapper, IIdentityRepository repository, IAuthenticationService authService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
        }

        protected async Task<IActionResult> RegisterUserWithRoles(UserRegisterRequest userRegisterRequest, IEnumerable<string> roles)
        {
            var user = _mapper.Map<User>(userRegisterRequest);

            // Validation
            TryValidateModel(user);            
            if (await _repository.GetUserByEmail(user.Email) != null)
            {
                // NOTE: This is validated only when the default UserRegisterRequest validation has passed
                ModelState.TryAddModelError(nameof(user.Email), ErrorMessages.EMAIL_UNIQUE);
            }
            if (!ModelState.IsValid)
            {
                // ValidationProblem is returned to match the body validation response template
                // See https://github.com/dotnet/aspnetcore/issues/6077 and https://github.com/dotnet/aspnetcore/issues/38504 for more details
                return ValidationProblem(ModelState);
            }
            
            // Create user
            if (!await _repository.CreateUser(user, userRegisterRequest.Password))
            {
                return BadRequest();
            }
            _logger.LogInformation($"Registered user with email: {user.Email}");

            // Add roles
            foreach (var role in roles)
            {
                if (await _repository.AddRoleToUser(user, role))
                {
                    _logger.LogInformation($"Added a role '{role}' to user: {user.UserName}.");
                }
                else
                {
                    _logger.LogWarning($"Role '{role}' does not exist.");
                }
            }

            return StatusCode(StatusCodes.Status201Created);
        }
    }
}
