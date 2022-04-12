using System.ComponentModel.DataAnnotations;

namespace Mailer.Models
{
    public class ReservationEmailModel
    {
        [EmailAddress]
        public string To { get; set; } = null!;
        public string ReservationNumber { get; set; } = null!;
        public string Movie { get; set; } = null!;
        public string Hall { get; set; } = null!;
        public string Seat { get; set; } = null!;
        public DateTime Time { get; set; }
        public double Price { get; set; }
    }
}
