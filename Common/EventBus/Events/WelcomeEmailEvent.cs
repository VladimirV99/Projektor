namespace Common.EventBus.Events
{
    public class WelcomeEmailEvent
    {
        public string To { get; }
        public string FirstName { get; }
        public string LastName { get; }
        
        public WelcomeEmailEvent(string to, string firstName, string lastName)
        {
            To = to ?? throw new ArgumentNullException(nameof(to));
            FirstName = firstName ?? throw new ArgumentNullException(nameof(firstName));
            LastName = lastName ?? throw new ArgumentNullException(nameof(lastName));
        }
    }
}
