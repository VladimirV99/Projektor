using AutoMapper;
using Identity.Data;
using Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Identity.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    //[Authorize(Roles = "Administrator")] // TODO Enable
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
            return await RegisterUserWithRoles(userRegisterRequest, new string[] { "Administrator" });
        }
    }
}
