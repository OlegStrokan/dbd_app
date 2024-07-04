using System.Data;
using Moq;
using Npgsql;

namespace report_worker.Tests;
using NUnit.Framework;

[TestFixture]
public class DbConnectionTests
{
    private const string TestConnectionString = "Host=localhost;Username=test;Passpowrd=test;Database=test";
    private Mock<IDbConnection> mockDbConnection;

    [SetUp]
    public void SetUp()
    {
        mockDbConnection = new Mock<IDbConnection>();
    }

    [Test]
    public void GetConnection_ShouldReturnNpgSqlConnection()
    {
        var dbConnection = new DbConnection(TestConnectionString, _ => mockDbConnection.Object);

        using (var connection = dbConnection.GetConnection())
        {
            Assert.That(connection, Is.InstanceOf<NpgsqlConnection>());
            Assert.That(connection.ConnectionString, Is.EqualTo((TestConnectionString)));
        }
    }

    [Test]
    public void GetConnection_ShouldOpenConnectionSuccessfully()
    {
        var dbConnection = new DbConnection(TestConnectionString);

        using (var connection = dbConnection.GetConnection())
        {
            Assert.DoesNotThrow(() => connection.Open());
            Assert.That(connection.State, Is.EqualTo(ConnectionState.Open));
        }
    }

    [Test]
    public void CustomConnectionFactory_ShouldReturnMockConnection()
    {
        var mockDbConnection = new Mock<IDbConnection>();
        var dbConnection = new DbConnection(TestConnectionString, _ => mockDbConnection.Object);

        using (var connection = dbConnection.GetConnection())
        {
            Assert.That(connection, Is.EqualTo(mockDbConnection.Object));
        }
    }
    
    
}