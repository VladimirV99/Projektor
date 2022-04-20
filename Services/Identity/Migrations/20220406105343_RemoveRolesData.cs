using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Migrations
{
    public partial class RemoveRolesData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "30d66919-a48e-4314-8932-e5951276063b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3e137be1-2709-49ac-a8fc-b5b2f1bca8dd");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "30d66919-a48e-4314-8932-e5951276063b", "6bbaab2d-5a04-4d47-9fd6-8ef6da6d2f65", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "3e137be1-2709-49ac-a8fc-b5b2f1bca8dd", "275d9fbb-5864-4966-b733-ff8896629488", "Customer", "CUSTOMER" });
        }
    }
}
