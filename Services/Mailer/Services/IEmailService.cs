using Mailer.Models;

namespace Mailer.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmail(EmailModel email);
    }
}
