using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.API.Migrations
{
    public partial class ForeignKeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MoviePeople_RoleId",
                table: "MoviePeople",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_MoviePeople_Roles_RoleId",
                table: "MoviePeople",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoviePeople_Roles_RoleId",
                table: "MoviePeople");

            migrationBuilder.DropIndex(
                name: "IX_MoviePeople_RoleId",
                table: "MoviePeople");
        }
    }
}
