using Microsoft.EntityFrameworkCore;
using Movies.API.Entities;

namespace Movies.API.Data
{
    public class MovieContext : DbContext
    {
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Person> People { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<MoviePerson> MoviePeople { get; set; }
        public DbSet<Genre> Genres { get; set; }

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