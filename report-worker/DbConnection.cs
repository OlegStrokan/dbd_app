
using System.Data;
using Npgsql;

public class DbConnection
{
    private readonly string connectionString;

    public DbConnection(string connectionString)
    {
        this.connectionString = connectionString;
    }

    protected IDbConnection GetConnection()
    {
        return new NpgsqlConnection(connectionString);
    }
}
