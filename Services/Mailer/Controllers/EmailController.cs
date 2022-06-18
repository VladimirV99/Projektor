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
            var model = new WelcomeEmailModel
            {
                To = "test@test.com",
                Name = "John Doe"
            };
            if (await _emailService.SendWelcomeEmail(model))
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
            var model = new ReservationEmailModel
            {
                To = "test@test.com",
                ReservationNumber = 1,
                Movie = "Example Movie",
                Hall = "Hall 1",
                Seats = new[] {new ReservationEmailModel.Seat {Row = 0, Column = 0}},
                Time = new DateTime(2022, 7, 1, 20, 30, 0),
                Price = 500.0
            };
            if (await _emailService.SendReservationEmail(model))
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
        public async Task<IActionResult> SendTestCancelReservationEmail()
        {
            var model = new CancelReservationEmailModel
            {
                To = "test@test.com",
                ReservationNumber = 1,
                Movie = "Example Movie",
                Time = new DateTime(2022, 7, 1, 20, 30, 0)
            };
            if (await _emailService.SendCancelReservationEmail(model))
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
        public async Task<IActionResult> SendRescheduleScreeningEmail()
        {
            var model = new RescheduleScreeningEmailModel
            {
                To = "test@test.com",
                ReservationNumber = 1,
                Movie = "Example Movie",
                OldTime = new DateTime(2022, 7, 1, 20, 30, 0),
                NewTime = new DateTime(2022, 7, 1, 21, 00, 0),
            };
            if (await _emailService.SendRescheduleScreeningEmail(model))
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
        public async Task<IActionResult> SendCancelScreeningEmail()
        {
            var model = new CancelScreeningEmailModel
            {
                To = "test@test.com",
                ReservationNumber = 1,
                Movie = "Example Movie",
                Time = new DateTime(2022, 7, 1, 20, 30, 0)
            };
            if (await _emailService.SendCancelScreeningEmail(model))
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
