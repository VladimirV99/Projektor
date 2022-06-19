using System.ComponentModel.DataAnnotations;

namespace Mailer.Models
{
    public class RescheduleScreeningEmailModel
    {
        [EmailAddress] public string To { get; set; } = null!;
        public int ReservationNumber { get; set; }
        public string Movie { get; set; } = null!;
        public DateTime OldTime { get; set; }
        public DateTime NewTime { get; set; }
    }
}