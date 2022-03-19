using AutoMapper;
using Identity.Constants;
using Identity.Data;
using Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Identity.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    //[Authorize(Roles = Roles.ADMINISTRATOR)] // TODO Enable
    public class AdministratorController : IdentityControllerBase
    {
        public AdministratorController(ILogger<AuthenticationController> logger, IMapper mapper, IIdentityRepository repository) : base(logger, mapper, repository)
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
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _repository.GetAllUsers();
            return Ok(_mapper.Map<IEnumerable<UserDetails>>(users));
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
            if (user != null)
            {
                if (user.Email == User.FindFirstValue(ClaimTypes.Email))
                    return BadRequest("Administrator can't delete his account");
                if((await _repository.GetUserRoles(user)).Contains(Roles.ADMINISTRATOR))
                    return BadRequest("Can't delete account of administrator");
                
                await _repository.DeleteUser(user!);
                return Ok();
            }
            return NotFound();
        }
    }
}
