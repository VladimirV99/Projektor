using Mailer.Models;

namespace Mailer.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmail(EmailModel email);
        Task<bool> SendWelcomeEmail(WelcomeEmailModel request);
        Task<bool> SendReservationEmail(ReservationEmailModel reservation);
    }
}
