namespace Identity.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Family { get; set; }
        public string Token { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        public bool IsActive => !IsRevoked && !IsExpired;
        public bool HasExceededTTL(double daysToLive) =>
            (IsRevoked && RevokedAt!.Value.AddDays(daysToLive) <= DateTime.UtcNow) ||
            (IsExpired && ExpiresAt.AddDays(daysToLive) <= DateTime.UtcNow);
    }
}
