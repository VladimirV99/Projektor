using System.Data;
using System.Data.SqlClient;

namespace Seeder
{
    public static class SqlHelper
    {
        public static void PrintVersion(SqlConnection connection)
        {
            using SqlCommand versionCommand = new("SELECT @@VERSION", connection);
            Console.WriteLine("SQL Version:");
            Console.WriteLine(versionCommand.ExecuteScalar().ToString());
        }

        public static void PrintTables(SqlConnection connection)
        {
            using SqlCommand tablesQuery = new("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES", connection);
            tablesQuery.ExecuteNonQuery();
            using SqlDataReader reader = tablesQuery.ExecuteReader();
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
            using SqlCommand tableQuery = new("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME=@TABLE", connection);
            tableQuery.Parameters.AddWithValue("@TABLE", tableName);
            tableQuery.ExecuteNonQuery();
            using SqlDataReader reader = tableQuery.ExecuteReader();
            return reader.HasRows;
        }

        public static void DeleteTable(SqlConnection connection, string tableName)
        {
            using SqlCommand dropCommand = new SqlCommand($"DROP TABLE IF EXISTS {tableName}", connection);
            dropCommand.ExecuteNonQuery();
        }

        public static bool TableHasData(SqlConnection connection, string tableName)
        {
            using SqlCommand countCommand = new SqlCommand($"SELECT COUNT(*) FROM {tableName}", connection);
            return (Int32)countCommand.ExecuteScalar() > 0;
        }

        public static void TruncateTable(SqlConnection connection, string tableName)
        {
            // TRUNCATE command can delete data only if there is no foreign key constraint
            using SqlCommand truncateCommand = new SqlCommand($"DELETE FROM {tableName}", connection);
            truncateCommand.ExecuteNonQuery();
        }

        public static void ResetIds(SqlConnection connection, string tableName)
        {
            using SqlCommand reseedCommand = new SqlCommand($"DBCC CHECKIDENT ({tableName}, RESEED, 0)", connection);
            reseedCommand.ExecuteNonQuery();
        }

        public static bool BulkInsert(SqlConnection connection, DataTable data, string tableName, bool overrideKey = false)
        {
            var options = overrideKey ? SqlBulkCopyOptions.KeepIdentity : SqlBulkCopyOptions.Default;
            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connection, options, null))
            {
                bulkCopy.DestinationTableName = tableName;

                foreach (DataColumn column in data.Columns)
                {
                    bulkCopy.ColumnMappings.Add(column.ColumnName, column.ColumnName);
                }
                
                bulkCopy.WriteToServer(data);
            }
            return true;
        }
    }
}
