using System.ComponentModel.DataAnnotations;

namespace Mailer.Models
{
    public class ReservationEmailModel
    {
        [EmailAddress]
        public string To { get; set; } = null!;
        public int ReservationNumber { get; set; }
        public string Movie { get; set; } = null!;
        public string Hall { get; set; } = null!;
        public Seat[] Seats { get; set; } = null!;
        public DateTime Time { get; set; }
        public double Price { get; set; }

        public class Seat
        {
            public int Row { get; set; }
            public int Column { get; set; }
        }
    }
}
