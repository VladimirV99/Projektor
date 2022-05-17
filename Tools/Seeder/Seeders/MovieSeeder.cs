using System.Data;
using System.Data.SqlClient;
using Seeder.Util;

namespace Seeder.Seeders;

public static class MovieSeeder
{
    public static void Seed()
    {
        const string moviesDataPath      = "Data/Movies/movies.tsv";
        const string genresDataPath      = "Data/Movies/genres.tsv";
        const string rolesDataPath       = "Data/Movies/roles.tsv";
        const string peopleDataPath      = "Data/Movies/people.tsv";
        const string movieGenresDataPath = "Data/Movies/movie_genres.tsv";
        const string moviePeopleDataPath = "Data/Movies/movie_people.tsv";
        
        try
        {
            // Read data files
            DataTable dtMovies      = CsvReader.ReadCsv(moviesDataPath) ?? throw new NullReferenceException(nameof(dtMovies));
            DataTable dtGenres      = CsvReader.ReadCsv(genresDataPath) ?? throw new NullReferenceException(nameof(dtGenres));
            DataTable dtRoles       = CsvReader.ReadCsv(rolesDataPath) ?? throw new NullReferenceException(nameof(dtRoles));
            DataTable dtPeople      = CsvReader.ReadCsv(peopleDataPath) ?? throw new NullReferenceException(nameof(dtPeople));
            DataTable dtMovieGenres = CsvReader.ReadCsv(movieGenresDataPath) ?? throw new NullReferenceException(nameof(dtMovieGenres));
            DataTable dtMoviePeople = CsvReader.ReadCsv(moviePeopleDataPath) ?? throw new NullReferenceException(nameof(dtMoviePeople));

            TableInsertRecord[] seedTables = {
                new ("Movies", dtMovies, true),
                new ("Genres", dtGenres, true),
                new ("Roles", dtRoles, true),
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
}