using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reservation.Migrations
{
    public partial class ReservationSeats : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Seats_SeatRow_SeatColumn_SeatHallId",
                table: "Reservations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Seats",
                table: "Seats");

            migrationBuilder.DropIndex(
                name: "IX_Seats_HallId",
                table: "Seats");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_SeatRow_SeatColumn_SeatHallId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "SeatColumn",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "SeatHallId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "SeatRow",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "Movie_Name",
                table: "Reservations",
                newName: "Movie_Title");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Seats",
                table: "Seats",
                columns: new[] { "HallId", "Row", "Column" });

            migrationBuilder.CreateTable(
                name: "ReservationSeat",
                columns: table => new
                {
                    ReservationsId = table.Column<int>(type: "int", nullable: false),
                    SeatsHallId = table.Column<int>(type: "int", nullable: false),
                    SeatsRow = table.Column<int>(type: "int", nullable: false),
                    SeatsColumn = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationSeat", x => new { x.ReservationsId, x.SeatsHallId, x.SeatsRow, x.SeatsColumn });
                    table.ForeignKey(
                        name: "FK_ReservationSeat_Reservations_ReservationsId",
                        column: x => x.ReservationsId,
                        principalTable: "Reservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReservationSeat_Seats_SeatsHallId_SeatsRow_SeatsColumn",
                        columns: x => new { x.SeatsHallId, x.SeatsRow, x.SeatsColumn },
                        principalTable: "Seats",
                        principalColumns: new[] { "HallId", "Row", "Column" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReservationSeat_SeatsHallId_SeatsRow_SeatsColumn",
                table: "ReservationSeat",
                columns: new[] { "SeatsHallId", "SeatsRow", "SeatsColumn" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReservationSeat");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Seats",
                table: "Seats");

            migrationBuilder.RenameColumn(
                name: "Movie_Title",
                table: "Reservations",
                newName: "Movie_Name");

            migrationBuilder.AddColumn<int>(
                name: "SeatColumn",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SeatHallId",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SeatRow",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Seats",
                table: "Seats",
                columns: new[] { "Row", "Column", "HallId" });

            migrationBuilder.CreateIndex(
                name: "IX_Seats_HallId",
                table: "Seats",
                column: "HallId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_SeatRow_SeatColumn_SeatHallId",
                table: "Reservations",
                columns: new[] { "SeatRow", "SeatColumn", "SeatHallId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Seats_SeatRow_SeatColumn_SeatHallId",
                table: "Reservations",
                columns: new[] { "SeatRow", "SeatColumn", "SeatHallId" },
                principalTable: "Seats",
                principalColumns: new[] { "Row", "Column", "HallId" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
