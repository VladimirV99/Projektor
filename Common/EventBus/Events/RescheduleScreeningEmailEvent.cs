namespace Common.EventBus.Events
{
    public class RescheduleScreeningEmailEvent
    {
        public string To { get; set; }
        public int ReservationNumber { get; set; }
        public string Movie { get; set; }
        public DateTime OldTime { get; set; }
        public DateTime NewTime { get; set; }

        public RescheduleScreeningEmailEvent(string to, int reservationNumber, string movie, DateTime oldTime,
            DateTime newTime)
        {
            To = to ?? throw new ArgumentNullException(nameof(to));
            ReservationNumber = reservationNumber;
            Movie = movie ?? throw new ArgumentNullException(nameof(movie));
            OldTime = oldTime;
            NewTime = newTime;
        }
    }
}