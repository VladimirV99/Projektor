using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Reservation.Data.EntityConfigurations
{
    public class ReservationEntityConfiguration : IEntityTypeConfiguration<Entities.Reservation>
    {
        public void Configure(EntityTypeBuilder<Entities.Reservation> builder)
        {
            builder.OwnsOne(r => r.User, u =>
            {
                u.Property(u => u.Id).IsRequired();
            });
            builder.Navigation(r => r.User).IsRequired();

            builder.OwnsOne(r => r.Screening);
            builder.Navigation(r => r.Screening).IsRequired();

            builder.OwnsOne(r => r.Movie);
            builder.Navigation(r => r.Movie).IsRequired();

            builder.HasMany(r => r.Seats);
        }
    }
}
