using Mailer.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Mailer.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value ?? throw new ArgumentNullException(nameof(emailSettings));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> SendEmail(EmailModel emailModel)
        {
            MimeMessage email = new();

            // Parse sender address
            try
            {
                email.Sender = MailboxAddress.Parse(_emailSettings.Address);
            }
            catch (Exception)
            {
                _logger.LogError("An error occurred trying to parse sender address: {Address}", _emailSettings.Address);
                return false;
            }
            // Parse recipient address
            try
            {
                email.To.Add(MailboxAddress.Parse(emailModel.To));
            }
            catch (Exception)
            {
                _logger.LogError("An error occurred trying to parse recipient address: {Address}", emailModel.To);
                return false;
            }

            // Set email subject
            email.Subject = emailModel.Subject;

            // Set email body
            BodyBuilder builder = new();
            if (emailModel.IsHTML)
            {
                builder.HtmlBody = emailModel.Body;
            }
            else
            {
                builder.TextBody = emailModel.Body;
            }
            email.Body = builder.ToMessageBody();

            // Send email
            using SmtpClient smtp = new();
            try
            {
                _logger.LogInformation("Sending email via server {ServerName}:{ServerPort}", _emailSettings.Host, _emailSettings.Port);
                smtp.Connect(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_emailSettings.Address, _emailSettings.Password);
                await smtp.SendAsync(email);
            }
            catch (Exception ex)
            {
                _logger.LogError("An error had occurred when sending email via SMTP server {ServerName}:{ServerPort} : {ErrorMessage}", _emailSettings.Host, _emailSettings.Port, ex.Message);
                return false;
            }
            finally
            {
                if (smtp.IsConnected)
                {
                    smtp.Disconnect(true);
                }
            }

            return true;
        }
    }
}
