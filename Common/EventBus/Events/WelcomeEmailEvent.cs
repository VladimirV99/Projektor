namespace Common.EventBus.Events
{
    public class WelcomeEmailEvent
    {
        public string To { get; set; }
        public string Name { get; set; }

        public WelcomeEmailEvent(string to, string name)
        {
            To = to ?? throw new ArgumentNullException(nameof(to));
            Name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }
}
