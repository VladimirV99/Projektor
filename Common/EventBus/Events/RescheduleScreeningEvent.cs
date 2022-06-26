namespace Common.EventBus.Events
{
    public class RescheduleScreeningEvent
    {
        public int ScreeningId { get; }
        public DateTime OldTime { get; }
        public DateTime NewTime { get; }

        public RescheduleScreeningEvent(int screeningId, DateTime oldTime, DateTime newTime)
        {
            ScreeningId = screeningId;
            OldTime = oldTime;
            NewTime = newTime;
        }
    }
}