using NATS.Client;
using NATS.Client.JetStream;
using NCrontab;

namespace report_worker;

public class ReportWorker : BackgroundService
{
    private readonly ILogger<ReportWorker> _logger;
    private readonly IConnection _natsConnection;
    private IJetStream _jetStream;
    private readonly string _reportRequestSubject = "report.requests";
    private readonly string _reportResponseSubject = "report.responses";
    private CrontabSchedule _schedule;
    private DateTime _nextRun;

    public ReportWorker(ILogger<ReportWorker> logger, IConnection natsConnection)
    {
        _logger = logger;
        _natsConnection = natsConnection;
        _jetStream = _natsConnection.CreateJetStreamContext();
        _schedule = CrontabSchedule.Parse("0 7 * * *"); // every day at 7 am
        _nextRun = _schedule.GetNextOccurrence(DateTime.Now);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Report Worker running at {Time}", DateTimeOffset.Now);


        var consumerOptions = ConsumerConfiguration.Builder()
            .WithDurable("report-worker")
            .Build();

        var pushSubscribeOptions = PushSubscribeOptions.Builder()
            .WithConfiguration(consumerOptions)
            .Build();

        _jetStream.PushSubscribeAsync(_reportRequestSubject, OnReportRequestReceived, false, pushSubscribeOptions);

        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.Now;
            if (now > _nextRun)
            {
                _logger.LogInformation("Generating scheduled report at: {Time}", DateTimeOffset.Now);

                var report = GenerateReport();

                await _jetStream.PublishAsync(_reportRequestSubject, report);

                _nextRun = _schedule.GetNextOccurrence(DateTime.Now);
            }

            await Task.Delay(1000, stoppingToken);
        }
    }

    private async void OnReportRequestReceived(object sender, MsgHandlerEventArgs args)
    {
      _logger.LogInformation("Received a manual report generation request");

      var report = GenerateReport();

      await _jetStream.PublishAsync(_reportRequestSubject, report);
      
      args.Message.Ack();
    }

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Report Worker is stopping");
        await base.StopAsync(stoppingToken);
    }

    private byte[] GenerateReport()
    {
        return new byte[3];
    }
}