using Identity.Entities;

namespace Identity.Data
{
    public interface IIdentityRepository
    {
        Task<bool> CreateUser(User user, string password);
        Task<bool> AddRoleToUser(User user, string role);
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserByEmail(string email);
    }
}
