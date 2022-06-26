namespace Common.EventBus.Events
{
    public class CancelScreeningEvent
    {
        public int ScreeningId { get; }
        
        public CancelScreeningEvent(int screeningId)
        {
            ScreeningId = screeningId;
        }
    }
}