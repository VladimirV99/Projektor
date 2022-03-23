using Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

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

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _userManager.Users.ToListAsync();
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<bool> CheckUserPassword(User user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        public async Task ChangeUserName(User user, string firstName, string lastName)
        {
            user.FirstName = firstName;
            user.LastName = lastName;
            await _userManager.UpdateAsync(user);
        }

        public async Task<bool> ChangeUserPassword(User user, string currentPassword, string newPassword)
        {
            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return result.Succeeded;
        }

        public async Task DeleteUser(User user)
        {
            await _userManager.DeleteAsync(user);
        }

        public async Task<bool> AddRoleToUser(User user, string role)
        {
            var roleExists = await _roleManager.RoleExistsAsync(role);

            if (!roleExists)
                return false;

            await _userManager.AddToRoleAsync(user, role);
            return true;
        }

        public async Task<IEnumerable<string>> GetUserRoles(User user)
        {
            return await _userManager.GetRolesAsync(user);
        }

        public async Task CreateRefreshToken(RefreshToken refreshToken)
        {
            _dbContext.RefreshTokens.Add(refreshToken);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<RefreshToken>> GetUserRefreshTokens(User user)
        {
            return await _dbContext.RefreshTokens.Where(t => t.UserId == user.Id).ToListAsync();
        }

        public async Task<RefreshToken?> FindRefreshToken(string refreshToken)
        {
            return await _dbContext.RefreshTokens.SingleOrDefaultAsync(t => t.Token == refreshToken);
        }

        public async Task UpdateRefreshToken(RefreshToken refreshToken)
        {
            _dbContext.Update(refreshToken);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteRefreshToken(RefreshToken refreshToken)
        {
            _dbContext.Remove(refreshToken);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteRefreshTokens(IEnumerable<RefreshToken> refreshTokens)
        {
            _dbContext.RemoveRange(refreshTokens);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteRefreshTokens(Expression<Func<RefreshToken, bool>> predicate)
        {
            await _dbContext.RefreshTokens.Where(predicate).ForEachAsync(t => _dbContext.RefreshTokens.Remove(t));
            await _dbContext.SaveChangesAsync();
        }
    }
}
