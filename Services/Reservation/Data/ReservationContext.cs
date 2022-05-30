using Microsoft.EntityFrameworkCore;
using Reservation.Data.EntityConfigurations;
using Reservation.Entities;

namespace Reservation.Data
{
    public class ReservationContext : DbContext
    {
        public DbSet<Entities.Reservation> Reservations => Set<Entities.Reservation>();
        public DbSet<Seat> Seats => Set<Seat>();
        public DbSet<Hall> Halls => Set<Hall>();

        public ReservationContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new ReservationEntityConfiguration());
            builder.ApplyConfiguration(new SeatEntityConfiguration());
        }
    }
}
