namespace report_worker;


using Dapper;
    
public class ParcelDeliveryRepository : DbConnection
{
    public ParcelDeliveryRepository(string connectionString) : base(connectionString)
    {
        
    }

    public decimal GetSum()
    {
        using (var connection = GetConnection())
        {
            try
            {
                connection.Open();
                var sum = connection.QueryFirstOrDefault<decimal>("SELECT SUM(\"parcelNumber\"::numeric) FROM \"parcel-delivery\"");
                return sum;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetSum(): {ex.Message}");
                throw;
            }
        }
    }
}