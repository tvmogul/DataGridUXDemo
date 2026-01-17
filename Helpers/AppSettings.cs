using Microsoft.Data.Sqlite;

public static class AppSettings
{
    private static readonly Dictionary<string, string> _cache = new();

    public static string? Get(string key)
    {
        if (_cache.TryGetValue(key, out var cached)) return cached;

        PathManager path = new PathManager();
        string dbFolder = path.GetWritableFolder("Libs");

        var dbFilePath = Path.Combine(dbFolder, "pandata.aidb");
        var connectionString = $"Data Source={dbFilePath};";

        using var conn = new SqliteConnection(connectionString);
        conn.Open();

        EnsureSettingsTableExists(conn);

        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT Value FROM Settings WHERE Key = @key";
        cmd.Parameters.AddWithValue("@key", key);
        var result = cmd.ExecuteScalar() as string;
        if (result != null) _cache[key] = result;
        return result;
    }

    public static void Set(string key, string value)
    {
        PathManager path = new PathManager();
        string dbFolder = path.GetWritableFolder("Libs");

        var dbFilePath = Path.Combine(dbFolder, "pandata.aidb");
        var connectionString = $"Data Source={dbFilePath};";

        using var conn = new SqliteConnection(connectionString);
        conn.Open();

        EnsureSettingsTableExists(conn);

        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO Settings (Key, Value) VALUES (@key, @value)
            ON CONFLICT(Key) DO UPDATE SET Value = excluded.Value";
        cmd.Parameters.AddWithValue("@key", key);
        cmd.Parameters.AddWithValue("@value", value);
        cmd.ExecuteNonQuery();
        _cache[key] = value;
    }

    private static void EnsureSettingsTableExists(SqliteConnection conn)
    {
        using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            CREATE TABLE IF NOT EXISTS Settings (
                Key TEXT PRIMARY KEY,
                Value TEXT
            );";
        cmd.ExecuteNonQuery();

        // Insert default TabStyle if it does not exist
        cmd.CommandText = @"
            INSERT INTO Settings (Key, Value)
            SELECT 'TabStyle', 'Chrome'
            WHERE NOT EXISTS (SELECT 1 FROM Settings WHERE Key = 'TabStyle');";
        cmd.ExecuteNonQuery();
    }
}
