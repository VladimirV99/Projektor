using System.Data;

namespace Seeder.Util;

public record TableInsertRecord(string TableName, DataTable Data, bool OverrideKey);
