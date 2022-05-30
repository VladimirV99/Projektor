using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reservation.Entities;

namespace Reservation.Data.EntityConfigurations
{
    public class SeatEntityConfiguration : IEntityTypeConfiguration<Seat>
    {
        public void Configure(EntityTypeBuilder<Seat> builder)
        {
            builder.HasKey(s => new { s.Row, s.Column, s.HallId });
            builder.Property(s => s.PriceMultiplier).HasDefaultValue(1f);
        }
    }
}
