using System.ComponentModel.DataAnnotations;

namespace Mailer.Models
{
    public class CancelReservationEmailModel
    {
        [EmailAddress]
        public string To { get; set; } = null!;
        public int ReservationNumber { get; set; }
        public string Movie { get; set; } = null!;
        public DateTime Time { get; set; }
    }
}