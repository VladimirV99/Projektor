using System.Data;
using Seeder.Util;

namespace Seeder.Seeders;

public static class ScreeningSeeder
{
    public static void Seed()
    {
        const string hallsDataPath      = "Data/Screenings/halls.tsv";
        const string moviesDataPath     = "Data/Screenings/movies.tsv";
        const string screeningsDataPath = "Data/Screenings/screenings.tsv";
        
        try
        {
            // Read data files
            DataTable dtHalls      = CsvReader.ReadCsv(hallsDataPath) ?? throw new NullReferenceException(nameof(dtHalls));
            DataTable dtMovies     = CsvReader.ReadCsv(moviesDataPath) ?? throw new NullReferenceException(nameof(dtMovies));
            DataTable dtScreenings = CsvReader.ReadCsv(screeningsDataPath) ?? throw new NullReferenceException(nameof(dtScreenings));

            TableInsertRecord[] seedTables = {
                new ("Halls", dtHalls, false),
                new ("Movies", dtMovies, false),
                new ("Screenings", dtScreenings, true)
            };
            
            SqlHelper.SeedData(
                "Server=localhost;Database=ScreeningDb;User Id=sa;Password=MatfRs2_MSSQL;",
                seedTables
            );
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}