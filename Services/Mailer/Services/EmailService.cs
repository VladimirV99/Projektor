using Mailer.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using QRCoder;

namespace Mailer.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        private Dictionary<string, string> _templateCache = new();

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

        public async Task<bool> SendWelcomeEmail(WelcomeEmailModel welcomeModel)
        {
            const string templateKey = "Welcome";
            string mailBody;
            if (_templateCache.ContainsKey(templateKey))
            {
                mailBody = _templateCache.GetValueOrDefault(templateKey, "");
            }
            else
            {
                string templatePath = $"{Directory.GetCurrentDirectory()}/Templates/WelcomeTemplate.html";
                try
                {
                    string template = File.ReadAllText(templatePath);
                    _templateCache.Add(templateKey, template);
                    mailBody = template;
                } 
                catch (Exception ex)
                {
                    _logger.LogError("Could not parse template file {Template}: {Error}", templatePath, ex.Message);
                    return false;
                }
            }
            
            mailBody = string.Format(mailBody, welcomeModel.Name);

            var email = new EmailModel
            {
                To = welcomeModel.To,
                Subject = "Welcome to Projektor",
                Body = mailBody,
                IsHTML = true
            };
            return await SendEmail(email);
        }

        public async Task<bool> SendReservationEmail(ReservationEmailModel reservationModel)
        {
            const string templateKey = "Reservation";
            string mailBody;
            if (_templateCache.ContainsKey(templateKey))
            {
                mailBody = _templateCache.GetValueOrDefault(templateKey, "");
            }
            else
            {
                string templatePath = $"{Directory.GetCurrentDirectory()}/Templates/ReservationTemplate.html";
                try
                {
                    string template = File.ReadAllText(templatePath);
                    _templateCache.Add(templateKey, template);
                    mailBody = template;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Could not parse template file {Template}: {Error}", templatePath, ex.Message);
                    return false;
                }
            }

            using QRCodeGenerator qrGenerator = new();
            using QRCodeData qrCodeData = qrGenerator.CreateQrCode(reservationModel.ReservationNumber, QRCodeGenerator.ECCLevel.Q);

            // This directly converts the code to base64, but doesn't work with dotnet6 until version 2.0
            //using Base64QRCode qrCode = new Base64QRCode(qrCodeData);
            //string qrCodeText = qrCode.GetGraphic(20);

            using PngByteQRCode qrCode = new(qrCodeData);
            string qrCodeText = Convert.ToBase64String(qrCode.GetGraphic(20));

            mailBody = string.Format(mailBody, reservationModel.Movie, reservationModel.Time, reservationModel.Hall,
                reservationModel.Seat, reservationModel.Price, reservationModel.ReservationNumber, qrCodeText);

            var email = new EmailModel
            {
                To = reservationModel.To,
                Subject = "Projektor Reservation Confirmation",
                Body = mailBody,
                IsHTML = true
            };
            return await SendEmail(email);
        }
    }
}
