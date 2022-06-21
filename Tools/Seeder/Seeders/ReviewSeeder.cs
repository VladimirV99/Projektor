using System.Data;
using Seeder.Util;

namespace Seeder.Seeders;

public static class ReviewSeeder
{
    public static void Seed()
    {
        const string reviewsDataPath       = "Data/Reviews/reviews.tsv";
        const string usersDataPath         = "Data/Reviews/users.tsv";
        const string watchedMoviesDataPath = "Data/Reviews/watched_movies.tsv";

        try
        {
            // Read data files
            DataTable dtReviews = CsvReader.ReadCsv(reviewsDataPath) ??
                                  throw new NullReferenceException(nameof(dtReviews));
            DataTable dtUsers = CsvReader.ReadCsv(usersDataPath) ?? throw new NullReferenceException(nameof(dtUsers));
            DataTable dtWatchedMovies = CsvReader.ReadCsv(watchedMoviesDataPath) ??
                                        throw new NullReferenceException(nameof(dtWatchedMovies));

            // // Unescape characters in review body
            // foreach(DataRow dr in dtReviews.Rows)
            // {
            //     dr["Body"] = ((string) dr["Body"])
            //         .Replace("\\t", "\t")
            //         .Replace("\\n", "\n")
            //         .Replace("\\\\", "\\");
            // }

            TableInsertRecord[] seedTables =
            {
                new ("users", dtUsers, false),
                new ("watchedmovies", dtWatchedMovies, false),
                new ("reviews", dtReviews, false)
            };
            
            PostgresHelper.SeedData(
                "Server=localhost;Database=ReviewDB;User Id=admin;Password=admin123;",
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
                new ("users", false),
                new ("watchedmovies", false),
                new ("reviews", false)
            };
            
            PostgresHelper.ClearData(
                "Server=localhost;Database=ReviewDB;User Id=admin;Password=admin123;",
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
            PostgresHelper.DropDatabase(
                "Server=localhost;Database=postgres;User Id=admin;Password=admin123;",
                "ReviewDB"
            );
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}