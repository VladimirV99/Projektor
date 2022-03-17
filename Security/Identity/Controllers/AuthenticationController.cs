using AutoMapper;
using Identity.Data;
using Identity.Entities;
using Identity.Models;
using Microsoft.AspNetCore.Mvc;

namespace Identity.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IMapper _mapper;
        private readonly IIdentityRepository _repository;

        public AuthenticationController(ILogger<AuthenticationController> logger, IMapper mapper, IIdentityRepository repository)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterCustomer([FromBody] UserRegisterRequest userRegisterRequest)
        {
            return await RegisterUserWithRoles(userRegisterRequest, new string[] { "Customer" });
        }

        // TODO Move to admin controller
        // [Authorize(Roles = "Administrator")]
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterAdministrator([FromBody] UserRegisterRequest userRegisterRequest)
        {
            return await RegisterUserWithRoles(userRegisterRequest, new string[] { "Administrator" });
        }

        private async Task<IActionResult> RegisterUserWithRoles(UserRegisterRequest userRegisterRequest, IEnumerable<string> roles)
        {
            var user = _mapper.Map<User>(userRegisterRequest);

            // TODO Validation messages
            if (!await _repository.CreateUser(user, userRegisterRequest.Password))
            {
                return BadRequest();
            }
            _logger.LogInformation($"Registered user with email: {user.Email}");

            foreach (var role in roles)
            {
                if (await _repository.AddRoleToUser(user, role))
                {
                    _logger.LogInformation($"Added a role '{role}' to user: {user.UserName}.");
                }
                else
                {
                    _logger.LogInformation($"Role '{role}' does not exist.");
                }
            }

            return StatusCode(StatusCodes.Status201Created);
        }
    }
}
