using report_worker;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services => { services.AddHostedService<ReportWorker>(); })
    .Build();

host.Run();