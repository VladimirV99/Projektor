using System.Data;
using Seeder.Util;

namespace Seeder.Seeders;

public static class ReservationSeeder
{
    public static void Seed()
    {
        const string hallsDataPath            = "Data/Reservations/halls.tsv";
        const string seatsDataPath            = "Data/Reservations/seats.tsv";
        const string reservationsDataPath     = "Data/Reservations/reservations.tsv";
        const string reservationSeatsDataPath = "Data/Reservations/reservation_seats.tsv";
        
        try
        {
            // Read data files
            DataTable dtHalls            = CsvReader.ReadCsv(hallsDataPath) ?? throw new NullReferenceException(nameof(dtHalls));
            DataTable dtSeats            = CsvReader.ReadCsv(seatsDataPath) ?? throw new NullReferenceException(nameof(dtSeats));
            DataTable dtReservations     = CsvReader.ReadCsv(reservationsDataPath) ?? throw new NullReferenceException(nameof(dtReservations));
            DataTable dtReservationSeats = CsvReader.ReadCsv(reservationSeatsDataPath) ?? throw new NullReferenceException(nameof(dtReservationSeats));
            
            TableInsertRecord[] seedTables = {
                new ("Halls", dtHalls, true),
                new ("Seats", dtSeats, false),
                new ("Reservations", dtReservations, true),
                new ("ReservationSeat", dtReservationSeats, false)
            };
            
            SqlHelper.SeedData(
                "Server=localhost;Database=ReservationDB;User Id=sa;Password=MatfRs2_MSSQL;",
                seedTables
            );
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    
    public static void Clear()
    {
        try
        {
            TableRecord[] tables = {
                new ("Halls", true),
                new ("Seats", false),
                new ("Reservations", true),
                new ("ReservationSeat", false)
            };
            
            SqlHelper.ClearData(
                "Server=localhost;Database=ReservationDB;User Id=sa;Password=MatfRs2_MSSQL;",
                tables
            );
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public static void Drop()
    {
        try
        {
            SqlHelper.DropDatabase(
                "Server=localhost;User Id=sa;Password=MatfRs2_MSSQL;",
                "ReservationDB"
            );
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}