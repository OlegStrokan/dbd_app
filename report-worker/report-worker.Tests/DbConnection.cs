using System.Data;
using Moq;
using Npgsql;
using NUnit.Framework;


namespace report_worker.Tests;

[TestFixture]
public class DbConnectionTests
{
    private const string TestConnectionString = "Server=localhost;Port=8436;Database=report_worker_test_db;User Id=stroka01;Password=user;";
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

    [Test, Ignore("Skipping this test because we fucking can")]
    public void CustomConnectionFactory_ShouldReturnNpgsqlConnection_WithCustomFactory()
    {
        
        var expectedConnection = new Mock<IDbConnection>().Object;
        var dbConnection = new DbConnection(TestConnectionString, _ => expectedConnection);

        using (var connection = dbConnection.GetConnection())
        {
            Assert.AreSame(expectedConnection, connection);
        } 
        
    }

    }