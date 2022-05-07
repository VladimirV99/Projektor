using System.Data;

namespace Seeder
{
    public static class CsvReader
    {
        public static DataTable? ReadCsv(string csvPath, string separator = "\t")
        {
            try
            {
                DataTable dt = new();
                using (StreamReader sr = new StreamReader(csvPath))
                {
                    // Read headers
                    var headerLine = sr.ReadLine();
                    if (headerLine == null)
                    {
                        return null;
                    }

                    var headers = headerLine.Split(separator);
                    foreach (var header in headers)
                    {
                        dt.Columns.Add(header);
                    }

                    // Read data
                    while (!sr.EndOfStream)
                    {
                        var rows = sr.ReadLine()?.Split(separator);
                        if (rows == null)
                        {
                            break;
                        }

                        DataRow dr = dt.NewRow();
                        for (int i = 0; i < headers.Length; i++)
                        {
                            dr[i] = rows[i];
                        }
                        dt.Rows.Add(dr);
                    }
                }
                return dt;
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine($"File Not Found: {csvPath}");
            }
            catch (Exception)
            {
                Console.WriteLine($"Could not read file: {csvPath}");
            }
            return null;
        }
    }
}
