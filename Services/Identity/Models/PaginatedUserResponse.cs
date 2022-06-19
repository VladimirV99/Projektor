namespace Identity.Models
{
    public class PaginatedUserResponse
    {
        public int Count { get; set; }
        public IEnumerable<UserDetails> Users { get; set; } = null!;
    }
}