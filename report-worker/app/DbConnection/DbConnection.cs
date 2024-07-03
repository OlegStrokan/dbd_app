using System.Data;

public class DbConnection
{
    private readonly string connectionString;
    private readonly Func<string, IDbConnection> connectionFactory;

    public DbConnection(string connectionString) : this(connectionString, connStr => new Npgsql.NpgsqlConnection(connStr))
    {
    }

    public DbConnection(string connectionString, Func<string, IDbConnection> connectionFactory)
    {
        this.connectionString = connectionString;
        this.connectionFactory = connectionFactory;
    }

    public IDbConnection GetConnection()
    {
        return connectionFactory(connectionString);
    }
}