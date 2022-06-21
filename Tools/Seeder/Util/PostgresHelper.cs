using System.Data;
using Npgsql;

namespace Seeder.Util;

public static class PostgresHelper
{
    public static void PrintVersion(NpgsqlConnection connection)
    {
        using var versionCommand = new NpgsqlCommand("SELECT version()", connection);
        Console.WriteLine("SQL Version:");
        var version = versionCommand.ExecuteScalar();
        Console.WriteLine(version == null ? "Unknown" : version.ToString());
    }
    
    public static void PrintTables(NpgsqlConnection connection)
    {
        using var tablesQuery = new NpgsqlCommand("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'information_schema' AND schemaname != 'pg_catalog'", connection);
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
    
    public static bool CheckTableExists(NpgsqlConnection connection, string tableName)
    {
        using var tableQuery = new NpgsqlCommand("SELECT * FROM pg_catalog.pg_tables WHERE tablename=@TABLE", connection);
        tableQuery.Parameters.AddWithValue("@TABLE", tableName);
        tableQuery.ExecuteNonQuery();
        using var reader = tableQuery.ExecuteReader();
        return reader.HasRows;
    }
    
    public static void DeleteTable(NpgsqlConnection connection, string tableName)
    {
        using var dropCommand = new NpgsqlCommand($"DROP TABLE IF EXISTS {tableName}", connection);
        dropCommand.ExecuteNonQuery();
    }

    public static bool TableHasData(NpgsqlConnection connection, string tableName)
    {
        using var countCommand = new NpgsqlCommand($"SELECT COUNT(*) FROM {tableName}", connection);
        var count = countCommand.ExecuteScalar();
        return count != null && (long)count > 0;
    }
    
    public static void TruncateTable(NpgsqlConnection connection, string tableName)
    {
        // TRUNCATE command can delete data only if there is no foreign key constraint
        using var truncateCommand = new NpgsqlCommand($"DELETE FROM {tableName}", connection);
        truncateCommand.ExecuteNonQuery();
    }
    
    public static void ResetIds(NpgsqlConnection connection, string tableName)
    {
        using var reseedCommand = new NpgsqlCommand($"ALTER SEQUENCE {tableName}_id_seq RESTART WITH 0", connection);
        reseedCommand.ExecuteNonQuery();
    }
    
    public static void BulkInsert(NpgsqlConnection connection, DataTable data, string tableName, bool overrideKey = false)
    {
        var columns = (from DataColumn column in data.Columns select column.ColumnName).ToArray();
        using var writer = connection.BeginTextImport($"COPY {tableName} ({string.Join(", ", columns)}) FROM STDIN WITH (DELIMITER  '|')");

        foreach (DataRow row in data.Rows)
        {
            for(var i = 0; i < data.Columns.Count; i++)
            {
                writer.Write(row[i]);
                if (i != data.Columns.Count - 1)
                    writer.Write("|");
            }
            writer.WriteLine();
        }
    }
    
    public static void SeedData(string connectionString, IEnumerable<TableInsertRecord> seedTables)
    {
        // Connect to database
        using var connection = new NpgsqlConnection(connectionString);
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
    
    public static void ClearData(string connectionString, IEnumerable<TableRecord> tables)
    {
        // Connect to database
        using var connection = new NpgsqlConnection(connectionString);
        connection.Open();

        Console.WriteLine();
        PrintVersion(connection);
        Console.WriteLine();
        PrintTables(connection);
        Console.WriteLine();

        // Seed data
        foreach (var (tableName, overrideKey) in tables)
        {
            Console.WriteLine($"Clearing table '{tableName}'");

            if (CheckTableExists(connection, tableName))
            {
                // Clear the table if it contains data
                if (TableHasData(connection, tableName))
                    TruncateTable(connection, tableName);
                // Reset id counter for the table
                if (overrideKey)
                    ResetIds(connection, tableName);
            }
            else
            {
                Console.WriteLine($"Error clearing table '{tableName}': Table doesn't exist");
            }
        }
    }

    public static void DropDatabase(string connectionString, string databaseName)
    {
        // Connect to database
        using var connection = new NpgsqlConnection(connectionString);
        connection.Open();

        Console.WriteLine();
        PrintVersion(connection);
        Console.WriteLine();
        
        Console.WriteLine($"Dropping database '{databaseName}'");
        try
        {
            using var dropCommand = new NpgsqlCommand($"DROP DATABASE \"{databaseName}\"", connection);
            dropCommand.ExecuteNonQuery();
        }
        catch (NpgsqlException e)
        {
            Console.WriteLine(e.Message);
        }
    }
}