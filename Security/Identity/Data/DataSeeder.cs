using AutoMapper;
using Common.Auth;
using Identity.Entities;
using Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Polly;

namespace Identity.Data
{
    public class DataSeeder : IDataSeeder
    {
        private readonly IIdentityRepository _identityRepository;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly ILogger<DataSeeder> _logger;

        public DataSeeder(IIdentityRepository identityRepository, UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, IMapper mapper, ILogger<DataSeeder> logger)
        {
            _identityRepository = identityRepository ?? throw new ArgumentNullException(nameof(identityRepository));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            _roleManager = roleManager ?? throw new ArgumentNullException(nameof(roleManager));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public void Seed()
        {
            try
            {
                int retryCount = 5;
                var retry = Policy.Handle<SqlException>()
                                .WaitAndRetry(
                                    retryCount: retryCount,
                                    sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                                    onRetry: (exception, retryNumber, context) =>
                                    {
                                        _logger.LogWarning("Retry {RetryNumber}/{RetryCount} of {Policy} at {Operation}, due to {Exception}", retryNumber, retryCount, context.PolicyKey, context.OperationKey, exception);
                                    });
                retry.Execute(() => SeedFunction().Wait());
            }
            catch (Exception)
            {
                _logger.LogError("Could not seed data. All attempts failed");
            }
        }

        private async Task SeedFunction()
        {
            // Seed roles
            string[] roles = new string[] { Roles.ADMINISTRATOR, Roles.CUSTOMER };

            foreach (string role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                    _logger.LogInformation("Created role: '{Role}'", role);
                }
            }

            // Seed admin account
            var adminSettings = _configuration.GetSection("Admin").Get<UserRegisterRequest>();
            var admin = await _identityRepository.GetUserByEmail(adminSettings.Email);
            // Check if admin account exists
            if (admin == null)
            {
                admin = _mapper.Map<User>(adminSettings);

                var result = await _userManager.CreateAsync(admin, adminSettings.Password);
                if (result.Succeeded)
                {
                    // Add administrator role
                    await _userManager.AddToRoleAsync(admin, Roles.ADMINISTRATOR);
                    _logger.LogInformation("Created administrator '{Email}' with password '{Password}'", adminSettings.Email, adminSettings.Password);
                }
                else
                {
                    _logger.LogError("Error creating administrator '{Email}'", adminSettings.Email);
                }
            }
            else
            {
                // If admin exists, check for administrator role
                if (!await _userManager.IsInRoleAsync(admin, Roles.ADMINISTRATOR))
                {
                    await _userManager.AddToRoleAsync(admin, Roles.ADMINISTRATOR);
                    _logger.LogInformation("Added administrator role to user '{Email}'", adminSettings.Email);
                }
            }

            _logger.LogInformation("Finished seeding data");
        }
    }
}
