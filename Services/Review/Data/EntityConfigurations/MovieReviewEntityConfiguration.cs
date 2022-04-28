using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Review.Entities;

namespace Review.Data.EntityConfigurations
{
    public class MovieReviewEntityConfiguration : IEntityTypeConfiguration<MovieReview>
    {
        public void Configure(EntityTypeBuilder<MovieReview> builder)
        {
            builder.HasKey(r => new { r.MovieId, r.ReviewerId });
        }
    }
}
