using Identity.Entities;
using Microsoft.AspNetCore.Identity;

namespace Identity.Data
{
    public class IdentityRepository : IIdentityRepository
    {
        private readonly IdentityContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public IdentityRepository(IdentityContext dbContext, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _roleManager = roleManager ?? throw new ArgumentNullException(nameof(roleManager));
        }

        public async Task<bool> CreateUser(User user, string password)
        {
            var result = await _userManager.CreateAsync(user, password);
            return result.Succeeded;
        }

        public async Task<bool> AddRoleToUser(User user, string role)
        {
            var roleExists = await _roleManager.RoleExistsAsync(role);
            if (roleExists)
            {
                await _userManager.AddToRoleAsync(user, role);
                return true;
            }
            return false;
        }
    }
}
