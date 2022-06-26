namespace Common.EventBus.Events
{
    public class RescheduleScreeningEmailEvent
    {
        public string To { get; }
        public int ReservationNumber { get; }
        public string Movie { get; }
        public DateTime OldTime { get; }
        public DateTime NewTime { get; }

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