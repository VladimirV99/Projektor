using AutoMapper;
using Common.Auth;
using Identity.Models;
using Identity.Repositories;
using Identity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Identity.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize(Roles = Roles.ADMINISTRATOR)]
    public class AdministratorController : IdentityControllerBase
    {
        public AdministratorController(ILogger<AuthenticationController> logger, IMapper mapper, IIdentityRepository repository, IAuthenticationService authService) 
            : base(logger, mapper, repository, authService)
        {
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterAdministrator([FromBody] UserRegisterRequest userRegisterRequest)
        {
            return await RegisterUserWithRoles(userRegisterRequest, new string[] { Roles.ADMINISTRATOR });
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<UserDetails>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<UserDetails>>> GetAllUsers()
        {
            var users = await _repository.GetAllUsers();
            return Ok(_mapper.Map<IEnumerable<UserDetails>>(users));
        }
        
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(PaginatedUserResponse), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedUserResponse>> GetCustomers([FromQuery] string? searchString, [FromQuery] PaginationRequest pagination)
        {
            var (count, users) = await _repository.GetCustomers(searchString ?? "", pagination.Page, pagination.PerPage);
            return Ok(new PaginatedUserResponse
            {
                Count = count,
                Users = _mapper.Map<IEnumerable<UserDetails>>(users)
            });
        }
        
        [HttpGet("[action]")]
        [ProducesResponseType(typeof(PaginatedUserResponse), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedUserResponse>> GetAdministrators([FromQuery] string? searchString, [FromQuery] PaginationRequest pagination)
        {
            var (count, users) = await _repository.GetAdministrators(searchString ?? "", pagination.Page, pagination.PerPage);
            return Ok(new PaginatedUserResponse
            {
                Count = count,
                Users = _mapper.Map<IEnumerable<UserDetails>>(users)
            });
        }

        [HttpGet("[action]/{email}")]
        [ProducesResponseType(typeof(UserDetails), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _repository.GetUserByEmail(email);
            if (user != null)
            {
                return Ok(_mapper.Map<UserDetails>(user));
            }
            return NotFound();
        }

        [HttpDelete("[action]/{email}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteUserByEmail(string email)
        {
            var user = await _repository.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound();
            }

            if (user.Email == User.FindFirstValue(ClaimTypes.Email))
            {
                return BadRequest("Administrator can't delete his account");
            }

            await _repository.DeleteUser(user!);
            return Ok();
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> RevokeAllTokens()
        {
            await _authService.RevokeAllTokens();
            return Ok();
        }
    }
}
