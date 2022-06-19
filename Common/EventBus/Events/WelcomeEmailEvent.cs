namespace Common.EventBus.Events
{
    public class WelcomeEmailEvent
    {
        public string To { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        
        public WelcomeEmailEvent(string to, string firstName, string lastName)
        {
            To = to ?? throw new ArgumentNullException(nameof(to));
            FirstName = firstName ?? throw new ArgumentNullException(nameof(firstName));
            LastName = lastName ?? throw new ArgumentNullException(nameof(lastName));
        }
    }
}
