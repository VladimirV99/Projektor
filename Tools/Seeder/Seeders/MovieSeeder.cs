using System.Data;
using Seeder.Util;

namespace Seeder.Seeders;

public static class MovieSeeder
{
    public static void Seed()
    {
        const string moviesDataPath      = "Data/Movies/movies.tsv";
        const string peopleDataPath      = "Data/Movies/people.tsv";
        const string movieGenresDataPath = "Data/Movies/movie_genres.tsv";
        const string moviePeopleDataPath = "Data/Movies/movie_people.tsv";
        
        try
        {
            // Read data files
            DataTable dtMovies      = CsvReader.ReadCsv(moviesDataPath) ?? throw new NullReferenceException(nameof(dtMovies));
            DataTable dtPeople      = CsvReader.ReadCsv(peopleDataPath) ?? throw new NullReferenceException(nameof(dtPeople));
            DataTable dtMovieGenres = CsvReader.ReadCsv(movieGenresDataPath) ?? throw new NullReferenceException(nameof(dtMovieGenres));
            DataTable dtMoviePeople = CsvReader.ReadCsv(moviePeopleDataPath) ?? throw new NullReferenceException(nameof(dtMoviePeople));

            TableInsertRecord[] seedTables = {
                new ("Movies", dtMovies, true),
                new ("People", dtPeople, true),
                new ("GenreMovie", dtMovieGenres, false),
                new ("MoviePeople", dtMoviePeople, false)
            };
            
            SqlHelper.SeedData(
                "Server=localhost;Database=MoviesDb;User Id=sa;Password=MatfRs2_MSSQL;",
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
                new ("Movies", true),
                new ("People", true),
                new ("GenreMovie", false),
                new ("MoviePeople", false)
            };
            
            SqlHelper.ClearData(
                "Server=localhost;Database=MoviesDb;User Id=sa;Password=MatfRs2_MSSQL;",
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
                "MoviesDb"
            );
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}