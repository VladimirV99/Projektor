namespace Reservation.Models
{
    public class HallBasicModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int Rows { get; set; }
        public int Columns { get; set; }
    }
}