using Microsoft.EntityFrameworkCore;
using Review.Data.EntityConfigurations;
using Review.Entities;

namespace Review.Data
{
    public class ReviewContext : DbContext
    {
        public DbSet<WatchedMovie> WatchedMovies => Set<WatchedMovie>();
        public DbSet<MovieReview> Reviews => Set<MovieReview>();
        public DbSet<User> Users => Set<User>();

        public ReviewContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new WatchedMovieEntityConfiguration());
            modelBuilder.ApplyConfiguration(new MovieReviewEntityConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityConfiguration());
        }
    }
}
