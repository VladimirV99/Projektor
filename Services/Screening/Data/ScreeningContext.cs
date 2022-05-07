using Screening.Entities;
using Microsoft.EntityFrameworkCore;

namespace Screening.Data
{
	public class ScreeningContext : DbContext
	{

        public DbSet<Entities.Screening> Screenings { get; set; }
        public DbSet<Movie> Movies { get; set; }

        public ScreeningContext(DbContextOptions options) : base(options)
        {
		}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}