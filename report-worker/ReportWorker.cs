using NATS.Client;
using NATS.Client.JetStream;
using System.Text;

namespace report_worker
{
    public class ReportWorker : BackgroundService
    {
        private readonly ILogger<ReportWorker> _logger;
        private readonly IConnection _natsConnection;
        private readonly ParcelDeliveryRepository _parcelDeliveryRepository;
        private IJetStream _jetStream;
        private IJetStreamManagement _jetStreamManagement;
        private readonly string _reportRequestSubject = "report.requests";
        private readonly string _reportResponseSubject = "report.responses";
        private readonly string _stream = "reports";

        public ReportWorker(ILogger<ReportWorker> logger, IConnection natsConnection, ParcelDeliveryRepository parcelDeliveryRepository)
        {
            _logger = logger;
            _natsConnection = natsConnection;
            _parcelDeliveryRepository = parcelDeliveryRepository;

            InitializeJetStream();
        }

        private void InitializeJetStream()
        {
            _jetStream = _natsConnection.CreateJetStreamContext();
            _jetStreamManagement = _natsConnection.CreateJetStreamManagementContext();

            try
            {
                var streams = _jetStreamManagement.GetStreams();
                bool streamExist = streams.Any(s => s.Config.Name == _stream);
                if (!streamExist)
                {
                    var config = StreamConfiguration.Builder()
                        .WithName(_stream)
                        .WithSubjects(_reportRequestSubject, _reportResponseSubject)
                        .Build();

                    _jetStreamManagement.AddStream(config);
                    _logger.LogInformation($"Created stream '{_stream}' with subjects '{_reportRequestSubject}' and '{_reportResponseSubject}'");
                }
            }
            catch (NATSBadSubscriptionException ex)
            {
                _logger.LogError($"Error creating stream {_stream}: {ex.Message}");
                throw;
            }

            var consumerOptions = ConsumerConfiguration.Builder()
                .WithDurable("report-worker")
                .Build();

            var pushSubscribeOptions = PushSubscribeOptions.Builder()
                .WithConfiguration(consumerOptions)
                .Build();

            _jetStream.PushSubscribeAsync(_reportRequestSubject, OnReportRequestReceived, false, pushSubscribeOptions);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Report Worker running at {Time}", DateTimeOffset.Now);

            var timer = new Timer(async _ =>
            {
                _logger.LogInformation("Generating scheduled report at: {Time}", DateTimeOffset.Now);

                var report = GenerateReport();

                await _jetStream.PublishAsync(_reportResponseSubject, report);

            }, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));

            await Task.Delay(Timeout.Infinite, stoppingToken);
        }

        private async void OnReportRequestReceived(object sender, MsgHandlerEventArgs args)
        {
            _logger.LogInformation("Received a manual report generation request");

            var report = GenerateReport();

            await _jetStream.PublishAsync(_reportResponseSubject, report);

            args.Message.Ack();
        }

        public override async Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Report Worker is stopping");
            
            await base.StopAsync(stoppingToken);
        }

        private byte[] GenerateReport()
        {
            decimal totalSum = _parcelDeliveryRepository.GetSum();

            byte[] convertedSum = Encoding.UTF8.GetBytes(totalSum.ToString());

            return convertedSum;
        }
    }
}
