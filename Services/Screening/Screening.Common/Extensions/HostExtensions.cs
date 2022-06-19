using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Screening.Common.Data;

namespace Screening.Common.Extensions
{
    public static class HostExtensions
    {
        public static void SeedDatabase(this IHost host)
        {
            using var scope = host.Services.CreateScope();
            var seeder = scope.ServiceProvider.GetService<IDataSeeder>();
            if (seeder != null)
            {
                seeder.Seed();
            }
        }
    }
}
