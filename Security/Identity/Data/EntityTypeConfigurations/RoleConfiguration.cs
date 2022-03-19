using Identity.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Data.EntityTypeConfigurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            // The IDs are predefined to avoid creating duplicates
            builder.HasData(
                new IdentityRole
                {
                    Id = "3e137be1-2709-49ac-a8fc-b5b2f1bca8dd",
                    Name = Roles.CUSTOMER,
                    NormalizedName = Roles.CUSTOMER.Normalize().ToUpperInvariant()
                },
                new IdentityRole
                {
                    Id = "30d66919-a48e-4314-8932-e5951276063b",
                    Name = Roles.ADMINISTRATOR,
                    NormalizedName = Roles.ADMINISTRATOR.Normalize().ToUpperInvariant()
                }
            );
        }
    }
}
