using System.Data;
using System.Data.SqlClient;

namespace Seeder.Util;

public static class SqlHelper
{
    public static void PrintVersion(SqlConnection connection)
    {
        using var versionCommand = new SqlCommand("SELECT @@VERSION", connection);
        Console.WriteLine("SQL Version:");
        Console.WriteLine(versionCommand.ExecuteScalar().ToString());
    }

    public static void PrintTables(SqlConnection connection)
    {
        using var tablesQuery = new SqlCommand("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES", connection);
        tablesQuery.ExecuteNonQuery();
        using var reader = tablesQuery.ExecuteReader();
        if (!reader.HasRows)
        {
            Console.WriteLine("There are no tables in the database");
        }
        else
        {
            Console.WriteLine("Tables in database:");
            while (reader.Read())
            {
                // for (int i = 0; i < reader.FieldCount; i++)
                // {
                //     Console.WriteLine(reader.GetName(i) + ":\t" + reader.GetValue(i));
                // }
                Console.WriteLine("- {0}", reader.GetString(0));
            }
        }
    }

    public static bool CheckTableExists(SqlConnection connection, string tableName)
    {
        using var tableQuery = new SqlCommand("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME=@TABLE",
            connection);
        tableQuery.Parameters.AddWithValue("@TABLE", tableName);
        tableQuery.ExecuteNonQuery();
        using var reader = tableQuery.ExecuteReader();
        return reader.HasRows;
    }

    public static void DeleteTable(SqlConnection connection, string tableName)
    {
        using var dropCommand = new SqlCommand($"DROP TABLE IF EXISTS {tableName}", connection);
        dropCommand.ExecuteNonQuery();
    }

    public static bool TableHasData(SqlConnection connection, string tableName)
    {
        using var countCommand = new SqlCommand($"SELECT COUNT(*) FROM {tableName}", connection);
        return (int) countCommand.ExecuteScalar() > 0;
    }

    public static void TruncateTable(SqlConnection connection, string tableName)
    {
        // TRUNCATE command can delete data only if there is no foreign key constraint
        using var truncateCommand = new SqlCommand($"DELETE FROM {tableName}", connection);
        truncateCommand.ExecuteNonQuery();
    }

    public static void ResetIds(SqlConnection connection, string tableName)
    {
        using var reseedCommand = new SqlCommand($"DBCC CHECKIDENT ({tableName}, RESEED, 0)", connection);
        reseedCommand.ExecuteNonQuery();
    }

    public static void BulkInsert(SqlConnection connection, DataTable data, string tableName,
        bool overrideKey = false)
    {
        var options = overrideKey ? SqlBulkCopyOptions.KeepIdentity : SqlBulkCopyOptions.Default;
        using var bulkCopy = new SqlBulkCopy(connection, options, null);
        bulkCopy.DestinationTableName = tableName;

        foreach (DataColumn column in data.Columns)
        {
            bulkCopy.ColumnMappings.Add(column.ColumnName, column.ColumnName);
        }

        bulkCopy.WriteToServer(data);
    }

    public static void SeedData(string connectionString, IEnumerable<TableInsertRecord> seedTables)
    {
        // Connect to database
        using var connection = new SqlConnection(connectionString);
        connection.Open();

        Console.WriteLine();
        PrintVersion(connection);
        Console.WriteLine();
        PrintTables(connection);
        Console.WriteLine();

        // Seed data
        foreach (var (tableName, data, overrideKey) in seedTables)
        {
            Console.WriteLine($"Seeding table '{tableName}'");

            if (CheckTableExists(connection, tableName))
            {
                // Clear the table if it contains data
                if (TableHasData(connection, tableName))
                    TruncateTable(connection, tableName);
                // Reset id counter for the table
                if (overrideKey)
                    ResetIds(connection, tableName);
                // Insert seed data
                BulkInsert(connection, data, tableName, overrideKey);
            }
            else
            {
                Console.WriteLine($"Error seeding table '{tableName}': Table doesn't exist");
            }
        }
    }
}