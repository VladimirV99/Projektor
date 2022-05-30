using Reservation.Data;

namespace Reservation.Extensions
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
