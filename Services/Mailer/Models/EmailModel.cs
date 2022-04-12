using System.ComponentModel.DataAnnotations;

namespace Mailer.Models
{
    public class EmailModel
    {
        [EmailAddress]
        public string To { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public bool IsHTML { get; set; }
        public string Body { get; set; } = null!;
    }
}
