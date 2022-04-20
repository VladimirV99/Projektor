using AutoMapper;
using Common.Auth;
using Identity.Constants;
using Identity.Data;
using Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Identity.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[Controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IIdentityRepository _repository;

        public UserController(IMapper mapper, IIdentityRepository repository)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(typeof(UserDetails), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDetails>> GetUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _repository.GetUserByEmail(email);
            if (user != null)
            {
                return Ok(_mapper.Map<UserDetails>(user));
            }
            return NotFound();
        }

        [Authorize]
        [HttpPut("[action]")]
        [ProducesResponseType(typeof(UserDetails), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDetails>> UpdateName([FromBody] UserChangeNameRequest userChangeNameRequest)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _repository.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound();
            }
            
            await _repository.ChangeUserName(user, userChangeNameRequest.FirstName, userChangeNameRequest.LastName);
            return Ok(_mapper.Map<UserDetails>(user));
        }

        [Authorize]
        [HttpPut("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDetails>> UpdatePassword([FromBody] UserChangePasswordRequest request)
        {
            if (request.CurrentPassword == request.NewPassword)
            {
                ModelState.TryAddModelError(nameof(request.NewPassword), ErrorMessages.NEW_PASSWORD_SAME);
                return ValidationProblem();
            }

            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _repository.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound();
            }

            var changed = await _repository.ChangeUserPassword(user, request.CurrentPassword, request.NewPassword);
            if (changed)
                return Ok();
            else
                return Unauthorized();
        }

        [Authorize(Roles = Roles.CUSTOMER)]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> DeleteUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _repository.GetUserByEmail(email);
            if (user != null)
            { 
                await _repository.DeleteUser(user);
            }
            return Ok();
        }
    }
}
