using Dapper;
using Npgsql;


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

            connection.Execute("DROP TABLE IF EXISTS \"parcel-delivery\";");
            connection.Execute(@"
                CREATE TABLE ""parcel-delivery"" (
                id SERIAL PRIMARY KEY,
                ""parcelNumber"" VARCHAR(50)
                                             );
                ");

            connection.Execute(@"
                INSERT INTO ""parcel-delivery"" (""parcelNumber"") VALUES ('10'), ('20'), ('30')
                ");
            
        }
    }

    [Test]
    public void GetSum_ShouldReturnCorrectSum()
    {
        var repository = new ParcelDeliveryRepository(TestConnectionString);

        var result = repository.GetSum();

        Assert.AreEqual(60, result);
    }


  
    [Test]
    public void GetSum_ShouldNotBeEqual()
    {
        var repository = new ParcelDeliveryRepository(TestConnectionString);

        var result = repository.GetSum();

        Assert.AreNotEqual(50, result);
    }

}