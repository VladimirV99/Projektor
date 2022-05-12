using Microsoft.EntityFrameworkCore;
using Reservation.Entities;

namespace Reservation.Data
{
    public class ReservationContext : DbContext
    {
        public DbSet<Entities.Reservation> Reservations { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Hall> Halls { get; set; }

        public ReservationContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Entities.Reservation>().OwnsOne(r => r.User);
            builder.Entity<Entities.Reservation>().OwnsOne(r => r.Screening);
            builder.Entity<Entities.Reservation>().OwnsOne(r => r.Movie);

            builder.Entity<Seat>()
                .HasKey(s => new { s.Row, s.Column, s.HallId });
        }
    }
}
