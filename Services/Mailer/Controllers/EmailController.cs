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

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
        public async Task<IActionResult> SendTestWelcomeEmail()
        {
            var welcomeModel = new WelcomeEmailModel
            {
                To = "test@test.com",
                Name = "John Doe"
            };
            if (await _emailService.SendWelcomeEmail(welcomeModel))
            {
                return Ok();
            }
            else
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable);
            }
        }

        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
        public async Task<IActionResult> SendTestReservationEmail()
        {
            var reservationModel = new ReservationEmailModel
            {
                To = "test@test.com",
                ReservationNumber = "0001",
                Movie = "Example Movie",
                Hall = "Hall 1",
                Seat = "A1",
                Time = new DateTime(2022, 4, 2, 20, 30, 0),
                Price = 500.0
            };
            if (await _emailService.SendReservationEmail(reservationModel))
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
