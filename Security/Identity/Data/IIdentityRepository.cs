﻿using Identity.Entities;

namespace Identity.Data
{
    public interface IIdentityRepository
    {
        Task<bool> CreateUser(User user, string password);
        Task<IEnumerable<User>> GetAllUsers();
        Task<User?> GetUserByEmail(string email);
        Task<bool> CheckUserPassword(User user, string password);
        Task ChangeUserName(User user, string firstName, string lastName);
        Task<bool> ChangeUserPassword(User user, string currentPassword, string newPassword);
        Task DeleteUser(User user);
        Task<bool> AddRoleToUser(User user, string role);
        Task<IEnumerable<string>> GetUserRoles(User user);
        Task CreateRefreshToken(RefreshToken refreshToken);
        IEnumerable<RefreshToken> GetUserRefreshTokens(User user);
        Task<RefreshToken?> FindRefreshToken(string refreshToken);
        Task UpdateRefreshToken(RefreshToken refreshToken);
    }
}
