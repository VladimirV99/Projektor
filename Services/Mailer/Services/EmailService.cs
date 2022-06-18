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

        private readonly Dictionary<string, string> _templateCache = new();

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

            // TODO remove this
            // _logger.LogInformation("Email sent: '" + email.Subject + "' to '" + email.To + "'");
            // return true;
            
            // Send email
            using SmtpClient smtp = new();
            try
            {
                _logger.LogInformation("Sending email via server {ServerName}:{ServerPort}", _emailSettings.Host, _emailSettings.Port);
                await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_emailSettings.Address, _emailSettings.Password);
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
                    await smtp.DisconnectAsync(true);
                }
            }

            return true;
        }

        private string? GetTemplate(string name)
        {
            if (_templateCache.ContainsKey(name))
            {
                return _templateCache.GetValueOrDefault(name, "");
            }

            var templatePath = $"{Directory.GetCurrentDirectory()}/Templates/{name}.html";
            try
            {
                var template = File.ReadAllText(templatePath);
                _templateCache.Add(name, template);
                return template;
            } 
            catch (Exception ex)
            {
                _logger.LogError("Could not parse template file {Template}: {Error}", templatePath, ex.Message);
                return null;
            }
        }

        public async Task<bool> SendWelcomeEmail(WelcomeEmailModel welcomeModel)
        {
            var mailBody = GetTemplate("WelcomeTemplate");
            if (mailBody == null)
            {
                return false;
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

        public async Task<bool> SendReservationEmail(ReservationEmailModel model)
        {
            var mailBody = GetTemplate("ReservationTemplate");
            if (mailBody == null)
            {
                return false;
            }

            using QRCodeGenerator qrGenerator = new();
            using QRCodeData qrCodeData =
                qrGenerator.CreateQrCode(model.ReservationNumber.ToString("D4"), QRCodeGenerator.ECCLevel.Q);

            // This directly converts the code to base64, but doesn't work with dotnet6 until version 2.0
            //using Base64QRCode qrCode = new Base64QRCode(qrCodeData);
            //string qrCodeText = qrCode.GetGraphic(20);

            using PngByteQRCode qrCode = new(qrCodeData);
            var qrCodeText = Convert.ToBase64String(qrCode.GetGraphic(20));

            mailBody = string.Format(mailBody, model.ReservationNumber, model.Movie, model.Time, model.Hall,
                string.Join(", ", model.Seats.Select(s => Convert.ToChar('A' + s.Row).ToString() + (s.Column + 1))),
                model.Price, qrCodeText);

            var email = new EmailModel
            {
                To = model.To,
                Subject = "Projektor: Reservation Confirmation",
                Body = mailBody,
                IsHTML = true
            };
            return await SendEmail(email);
        }

        public async Task<bool> SendCancelReservationEmail(CancelReservationEmailModel model)
        {
            var mailBody = GetTemplate("CancelReservationTemplate");
            if (mailBody == null)
            {
                return false;
            }
            
            mailBody = string.Format(mailBody, model.ReservationNumber, model.Movie, model.Time);

            var email = new EmailModel
            {
                To = model.To,
                Subject = "Projektor: Reservation Canceled",
                Body = mailBody,
                IsHTML = true
            };
            return await SendEmail(email);
        }

        public async Task<bool> SendRescheduleScreeningEmail(RescheduleScreeningEmailModel model)
        {
            var mailBody = GetTemplate("RescheduleScreeningTemplate");
            if (mailBody == null)
            {
                return false;
            }
            
            mailBody = string.Format(mailBody, model.ReservationNumber, model.Movie, model.OldTime, model.NewTime);

            var email = new EmailModel
            {
                To = model.To,
                Subject = "Projektor: Screening Time Moved",
                Body = mailBody,
                IsHTML = true
            };
            return await SendEmail(email);
        }

        public async Task<bool> SendCancelScreeningEmail(CancelScreeningEmailModel model)
        {
            var mailBody = GetTemplate("CancelScreeningTemplate");
            if (mailBody == null)
            {
                return false;
            }
            
            mailBody = string.Format(mailBody, model.ReservationNumber, model.Movie, model.Time);

            var email = new EmailModel
            {
                To = model.To,
                Subject = "Projektor: Screening Canceled",
                Body = mailBody,
                IsHTML = true
            };
            return await SendEmail(email);
        }
    }
}
