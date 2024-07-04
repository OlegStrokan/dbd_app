using Dapper;
using Npgsql;
using NUnit.Framework;

namespace report_worker;


[TestFixture]
public class ParcelDeliveryRepositoryTests
{
    private const string TestConnectionString =  "Server=localhost;Port=8436;Database=report_worker_test_db;User Id=stroka01;Password=user;";


    [SetUp]
    public void SetUp()
    {
        using (var connection = new NpgsqlConnection(TestConnectionString))
        {
            connection.Open();

            connection.Execute("DROP TABLE IF EXISTS \"parcel_delivery\";");
            connection.Execute(@"
                CREATE TABLE parcel_delivery (
                id SERIAL PRIMARY KEY,
                parcel_number VARCHAR(50)
                                             );
                ");

            connection.Execute(@"
                INSERT INTO parcel_delivery (parcel_number) VALUES ('10'), ('20'), ('30')
                ");
            
        }
    }

    [Test]
    public void GetSum_ShouldReturnCorrectSum()
    {
        var repository = new ParcelDeliveryRepository(TestConnectionString);

        var result = repository.GetSum();

        Assert.Equals(60, result);
    }


    [Test]
    public void GetSum_ShouldHandleEmptyTable()
    {
        using (var connection = new NpgsqlConnection(TestConnectionString))
        {
            connection.Open();
            connection.Execute("TRUNCATE TABLE parcel_delivery");
        }

        var repository = new ParcelDeliveryRepository(TestConnectionString);

        var result = repository.GetSum();

        Assert.Equals(0, result);
    }
}