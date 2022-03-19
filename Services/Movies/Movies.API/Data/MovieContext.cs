using Microsoft.EntityFrameworkCore;
using Movies.API.Entities;

namespace Movies.API.Data
{
    public class MovieContext : DbContext
    {
        public DbSet<Movie> Movies { get; }
        public DbSet<Person> People { get; }
        public DbSet<Role> Roles { get; }
        public DbSet<MoviePerson> MoviePeople { get; }
        public DbSet<Genre> Genres { get; }

        public MovieContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<MoviePerson>()
                .HasKey(mp => new { mp.MovieId, mp.PersonId, mp.RoleId });
        }
    }
}