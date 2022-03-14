namespace Identity.Data
{
    public class IdentityRepository : IIdentityRepository
    {
        private readonly IdentityContext _dbContext;

        public IdentityRepository(IdentityContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }
    }
}
