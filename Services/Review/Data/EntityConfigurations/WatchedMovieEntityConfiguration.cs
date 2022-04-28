using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Review.Entities;

namespace Review.Data.EntityConfigurations
{
    public class WatchedMovieEntityConfiguration : IEntityTypeConfiguration<WatchedMovie>
    {
        public void Configure(EntityTypeBuilder<WatchedMovie> builder)
        {
            builder.HasKey(wm => new { wm.MovieId, wm.UserId });
        }
    }
}
