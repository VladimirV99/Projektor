using Screening.Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace Screening.Common.Data
{
	public class ScreeningContext : DbContext
	{
        public DbSet<Entities.Screening> Screenings => Set<Entities.Screening>();
        public DbSet<Movie> Movies => Set<Movie>();
        public DbSet<Hall> Halls => Set<Hall>();

        public ScreeningContext(DbContextOptions options) : base(options)
        {
		}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Movie>().Property(m => m.Id).ValueGeneratedNever();
            builder.Entity<Hall>().Property(h => h.Id).ValueGeneratedNever();
        }
    }
}