using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reservation.Migrations
{
    public partial class Reservation2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Screening_ScreeningId",
                table: "Reservations");

            migrationBuilder.DropTable(
                name: "Screening");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_ScreeningId",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "Reservations",
                newName: "User_Id");

            migrationBuilder.RenameColumn(
                name: "ScreeningId",
                table: "Reservations",
                newName: "Screening_Id");

            migrationBuilder.AddColumn<DateTime>(
                name: "Screening_MovieStart",
                table: "Reservations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Screening_MovieStart",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "User_Id",
                table: "Reservations",
                newName: "userId");

            migrationBuilder.RenameColumn(
                name: "Screening_Id",
                table: "Reservations",
                newName: "ScreeningId");

            migrationBuilder.CreateTable(
                name: "Screening",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MovieStart = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Screening", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_ScreeningId",
                table: "Reservations",
                column: "ScreeningId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Screening_ScreeningId",
                table: "Reservations",
                column: "ScreeningId",
                principalTable: "Screening",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
