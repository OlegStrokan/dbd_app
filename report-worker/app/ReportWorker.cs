using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NATS.Client;
using NATS.Client.JetStream;
using Quartz;
using Quartz.Impl;

namespace report_worker
{
    public class ReportWorker : BackgroundService
    {
        private readonly ILogger<ReportWorker> _logger;
        private readonly IConnection _natsConnection;
        private readonly IParcelDeliveryRepository _parcelDeliveryRepository;
        private IJetStream _jetStream;
        private IJetStreamManagement _jetStreamManagement;
        private readonly string _reportRequestSubject = "report.requests";
        private readonly string _reportResponseSubject = "report.responses";
        private readonly string _stream = "reports";
        private IScheduler _scheduler;

        public ReportWorker(ILogger<ReportWorker> logger, IConnection natsConnection, IParcelDeliveryRepository parcelDeliveryRepository)
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
                var streams = _jetStreamManagement.GetStreams() ?? Array.Empty<StreamInfo>();
                var streamExist = streams.Any(s => s.Config.Name == _stream);
                if (streamExist) return;

                var config = StreamConfiguration.Builder()
                    .WithName(_stream)
                    .WithSubjects(_reportRequestSubject, _reportResponseSubject)
                    .Build();

                _jetStreamManagement.AddStream(config);
                _logger.LogInformation($"Created stream '{_stream}' with subjects '{_reportRequestSubject}' and '{_reportResponseSubject}'");
            }
            catch (NATSBadSubscriptionException ex)
            {
                _logger.LogError($"Error creating stream {_stream}: {ex.Message}");
                throw;
            }
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Report Worker started.");

            // Initialize JetStream and Quartz scheduler
            InitializeJetStream();
            await ScheduleQuartzJob();

            await base.StartAsync(cancellationToken);
        }

        private async Task ScheduleQuartzJob()
        {
            _logger.LogInformation("Scheduling Quartz job...");

            _scheduler = await new StdSchedulerFactory().GetScheduler();
            await _scheduler.Start();

            // Define the job and tie it to our JobHandler
            var jobDetail = JobBuilder.Create<GenerateReportJob>()
                .WithIdentity("generateReportJob", "reportGroup")
                .Build();

            // Trigger the job to run now, and then every second
            var trigger = TriggerBuilder.Create()
                .WithIdentity("generateReportTrigger", "reportGroup")
                .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInSeconds(1)
                    .RepeatForever())
                .Build();

            await _scheduler.ScheduleJob(jobDetail, trigger);
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Report Worker stopping.");

            // Shutdown Quartz scheduler
            await _scheduler.Shutdown();

            await base.StopAsync(cancellationToken);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // This method will not be used for scheduling purposes with Quartz
            return Task.CompletedTask;
        }
    }

    // JobHandler class to generate report
    public class GenerateReportJob : IJob
    {
        private readonly ILogger<GenerateReportJob> _logger;
        private readonly IJetStream _jetStream;
        private readonly string _reportRequestSubject;

        public GenerateReportJob(ILogger<GenerateReportJob> logger, IConnection natsConnection)
        {
            _logger = logger;
            _jetStream = natsConnection.CreateJetStreamContext();
            _reportRequestSubject = "report.requests"; // Use the same subject as in ReportWorker
        }

        public async Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("Generating scheduled report at: {Time}", DateTimeOffset.Now);

            var report = GenerateReport();

            await _jetStream.PublishAsync(_reportRequestSubject, report);
        }

        private byte[] GenerateReport()
        {
            // Simulating report generation
            var totalSum = 1000; // Example: Replace with your logic to calculate report
            var convertedSum = Encoding.UTF8.GetBytes(totalSum.ToString());
            return convertedSum;
        }
    }
}
