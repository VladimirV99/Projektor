using System.ComponentModel.DataAnnotations;

namespace Mailer.Models
{
    public class EmailSettings
    {
        [EmailAddress]
        public string Address { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Host { get; set; } = null!;
        public int Port { get; set; }
    }
}
