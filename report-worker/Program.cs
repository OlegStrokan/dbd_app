
using NATS.Client;
using report_worker;

namespace ReportWorkerApp
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var host = Host.CreateDefaultBuilder(args)
                .ConfigureServices((context, services) =>
                {
                    // Register services
                    services.AddSingleton<IConnection>(NATSConnection());
                    services.AddSingleton<ParcelDeliveryRepository>(sp => new ParcelDeliveryRepository(GetConnectionString()));
                    services.AddHostedService<ReportWorker>();
                })
                .Build();

            await host.RunAsync();
        }

        private static IConnection NATSConnection()
        {
            Options opts = ConnectionFactory.GetDefaultOptions();
            opts.Url = "nats://localhost:4222";

            IConnection connection = new ConnectionFactory().CreateConnection(opts);
            return connection;
        }

        private static string GetConnectionString()
        {
            return "Server=localhost;Port=5433;Database=dev_db;User Id=stroka01;Password=user;";

        }
    }
}
