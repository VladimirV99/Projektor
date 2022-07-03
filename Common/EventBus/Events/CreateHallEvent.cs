namespace Common.EventBus.Events
{
    public class CreateHallEvent
    {
        public int Id { get; }
        public string Name { get; } = null!;
        public CreateHallEvent(int id, string name)
        {
            Id = id;
            Name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }
}
