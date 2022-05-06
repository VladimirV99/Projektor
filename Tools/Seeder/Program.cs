using System.Data;
using System.Data.SqlClient;
using Seeder;

void PrintDataTable(DataTable table)
{
    foreach(DataRow row in table.Rows)
    {
        foreach(DataColumn column in table.Columns)
        {
            Console.Write(row[column] + "\t\t");
        }
        Console.WriteLine();
    }
}

const string moviesCsvPath      = "csv/movies.csv";
const string genresCsvPath      = "csv/genres.csv";
const string rolesCsvPath       = "csv/roles.csv";
const string peopleCsvPath      = "csv/people.csv";
const string movieGenresCsvPath = "csv/movie_genres.csv";
const string moviePeopleCsvPath = "csv/movie_people.csv";

try
{
    // Read data files
    DataTable dtMovies      = CsvReader.ReadCsv(moviesCsvPath) ?? throw new NullReferenceException(nameof(dtMovies));
    DataTable dtGenres      = CsvReader.ReadCsv(genresCsvPath) ?? throw new NullReferenceException(nameof(dtGenres));
    DataTable dtRoles       = CsvReader.ReadCsv(rolesCsvPath) ?? throw new NullReferenceException(nameof(dtRoles));
    DataTable dtPeople      = CsvReader.ReadCsv(peopleCsvPath) ?? throw new NullReferenceException(nameof(dtPeople));
    DataTable dtMovieGenres = CsvReader.ReadCsv(movieGenresCsvPath) ?? throw new NullReferenceException(nameof(dtMovieGenres));
    DataTable dtMoviePeople = CsvReader.ReadCsv(moviePeopleCsvPath) ?? throw new NullReferenceException(nameof(dtMoviePeople));

    // Connect to database
    const string connectionString = "Server=localhost;Database=MoviesDb;User Id=sa;Password=MatfRs2_MSSQL;";
    using SqlConnection connection = new SqlConnection(connectionString);
    connection.Open();

    Console.WriteLine();
    SqlHelper.PrintVersion(connection);
    Console.WriteLine();
    SqlHelper.PrintTables(connection);
    Console.WriteLine();

    // Seed data
    (string, DataTable)[] seedTables = {
        ("Movies", dtMovies),
        ("Genres", dtGenres),
        ("Roles", dtRoles),
        ("People", dtPeople),
        ("GenreMovie", dtMovieGenres),
        ("MoviePeople", dtMoviePeople)
    };
    foreach ((string tableName, DataTable data) in seedTables)
    {
        Console.WriteLine($"Seeding table '{tableName}'");

        if (SqlHelper.CheckTableExists(connection, tableName))
        {
            // Clear the table if it contains data
            if (SqlHelper.TableHasData(connection, tableName))
                SqlHelper.TruncateTable(connection, tableName);
            // Reset id counter for the table
            if (data.Columns.Contains("Id"))
                SqlHelper.ResetIds(connection, tableName);
            // Insert seed data (Note: The data ID column is ignored. IDs are genereated by the database)
            SqlHelper.BulkInsert(connection, data, tableName);
        }
        else
        {
            Console.WriteLine($"Error seeding table '{tableName}': Table doesn't exist");
        }
    }
}
catch (Exception e)
{
    Console.WriteLine(e);
    throw;
}