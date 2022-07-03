using Microsoft.EntityFrameworkCore;
using Movies.Common.Entities;

namespace Movies.Common.Data
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
            builder.Entity<Genre>().HasData(
                new Genre {Id=1, Name = "Action"},
                new Genre {Id=2, Name = "Adventure"},
                new Genre {Id=3, Name = "Animation"},
                new Genre {Id=4, Name = "Biography"},
                new Genre {Id=5, Name = "Comedy"},
                new Genre {Id=6, Name = "Crime"},
                new Genre {Id=7, Name = "Documentary"},
                new Genre {Id=8, Name = "Drama"},
                new Genre {Id=9, Name = "Family"},
                new Genre {Id=10, Name = "Fantasy"},
                new Genre {Id=11, Name = "History"},
                new Genre {Id=12, Name = "Horror"},
                new Genre {Id=13, Name = "Music"},
                new Genre {Id=14, Name = "Musical"},
                new Genre {Id=15, Name = "Mystery"},
                new Genre {Id=16, Name = "Romance"},
                new Genre {Id=17, Name = "Sci-Fi"},
                new Genre {Id=18, Name = "Sport"},
                new Genre {Id=19, Name = "Thriller"},
                new Genre {Id=20, Name = "War"},
                new Genre {Id=21, Name = "Western"});
            builder.Entity<Role>().HasData(
                new Role{Id=1, Name="Actor", Description = ""},
                new Role{Id=2, Name="Director", Description = ""},
                new Role{Id=3, Name="Writer", Description = ""}
            );
        }
    }
}