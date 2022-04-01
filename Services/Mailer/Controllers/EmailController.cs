using Mailer.Models;
using Mailer.Services;
using Microsoft.AspNetCore.Mvc;

namespace Mailer.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
        public async Task<IActionResult> SendTestEmail()
        {
            var email = new EmailModel
            {
                To = "test@test.com",
                Subject = "Test",
                Body = "This is a test email",
                IsHTML = false
            };
            if (await _emailService.SendEmail(email))
            {
                return Ok();
            }
            else
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable);
            }
        }
    }
}
