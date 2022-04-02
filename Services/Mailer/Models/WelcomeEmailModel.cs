using System.ComponentModel.DataAnnotations;

namespace Mailer.Models
{
    public class WelcomeEmailModel
    {
        [EmailAddress]
        public string To { get; set; } = null!;
        public string Name { get; set; } = null!;
    }
}
