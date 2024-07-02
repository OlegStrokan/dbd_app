using NATS.Client;
using NATS.Client.JetStream;

namespace report_worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IConnection _natsConnection;
    private IJetStream _jetStream;

    public Worker(ILogger<Worker> logger, IConnection natsConnection)
    {
        _logger = logger;
        _natsConnection = natsConnection;
        _jetStream = natsConnection.CreateJetStreamContext();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
       
    }
}