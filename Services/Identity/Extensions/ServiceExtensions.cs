using Identity.Constants;
using Identity.Data;
using Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Identity.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection ConfigurePersistence(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<IdentityContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("IdentityConnectionString"));
            });
            services.AddScoped<IIdentityRepository, IdentityRepository>();
            services.AddTransient<IDataSeeder, DataSeeder>();

            return services;
        }

        public static IServiceCollection ConfigureIdentity(this IServiceCollection services)
        {
            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.Password.RequireLowercase = Settings.PASSWORD_REQUIRE_LOWERCASE;
                options.Password.RequireUppercase = Settings.PASSWORD_REQUIRE_UPPERCASE;
                options.Password.RequireDigit = Settings.PASSWORD_REQUIRE_DIGIT;
                options.Password.RequireNonAlphanumeric = Settings.PASSWORD_REQUIRE_SYMBOL;
                options.Password.RequiredLength = Settings.PASSWORD_MIN_LENGTH;
                options.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<IdentityContext>()
                .AddDefaultTokenProviders();

            return services;
        }
    }
}
