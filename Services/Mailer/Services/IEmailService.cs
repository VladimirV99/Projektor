using Mailer.Models;

namespace Mailer.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmail(EmailModel email);
        Task<bool> SendWelcomeEmail(WelcomeEmailModel model);
        Task<bool> SendReservationEmail(ReservationEmailModel model);
        Task<bool> SendCancelReservationEmail(CancelReservationEmailModel model);
        Task<bool> SendRescheduleScreeningEmail(RescheduleScreeningEmailModel model);
        Task<bool> SendCancelScreeningEmail(CancelScreeningEmailModel model);
    }
}
