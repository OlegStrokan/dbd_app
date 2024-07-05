using System.Text;
using Microsoft.Extensions.Logging;
using Moq;
using NATS.Client;
using NATS.Client.JetStream;
using Quartz;

// TODO fix tests
namespace report_worker.Tests
{
    [TestFixture]
    public class ReportWorkerTests
    {
        private Mock<ILogger<ReportWorker>> _loggerMock;
        private Mock<IConnection> _natsConnectionMock;
        private Mock<IJetStream> _jetStreamMock;
        private Mock<IJetStreamManagement> _jetStreamManagementMock;
        private Mock<IParcelDeliveryRepository> _parcelDeliveryRepositoryMock;
        private Mock<IScheduler> _schedulerMock;

        private ReportWorker _reportWorker;

        private const string ReportRequestSubject = "report.requests";
        private const string ReportResponseSubject = "report.responses";
        private const string StreamName = "reports";

        [SetUp]
        public void SetUp()
        {
            _loggerMock = new Mock<ILogger<ReportWorker>>();
            _natsConnectionMock = new Mock<IConnection>();
            _jetStreamMock = new Mock<IJetStream>();
            _jetStreamManagementMock = new Mock<IJetStreamManagement>();
            _parcelDeliveryRepositoryMock = new Mock<IParcelDeliveryRepository>();
            _schedulerMock = new Mock<IScheduler>();

            _natsConnectionMock.Setup(c => c.CreateJetStreamContext(null)).Returns(_jetStreamMock.Object);
            _natsConnectionMock.Setup(c => c.CreateJetStreamManagementContext(null)).Returns(_jetStreamManagementMock.Object);

            _reportWorker = new ReportWorker(
                _loggerMock.Object,
                _natsConnectionMock.Object,
                _parcelDeliveryRepositoryMock.Object
            );
        }
        

        [Test]
        public void InitializeJetStream_ShouldCreateStreamIfNotExists()
        {
            _jetStreamManagementMock.Setup(m => m.GetStreams()).Returns(new StreamInfo[0]);

            _jetStreamManagementMock.Verify(m => m.AddStream(It.IsAny<StreamConfiguration>()), Times.Once);
            VerifyLogger(LogLevel.Information, $"Created stream '{StreamName} with subjects '{ReportRequestSubject}' and '{ReportResponseSubject}'");
        }
        

        [Test]
        public async Task ExecuteAsync_ShouldGenerateScheduledReports()
        {
            // Arrange
            var report = Encoding.UTF8.GetBytes("TestReport");

            _jetStreamMock.Setup(j => j.PublishAsync(ReportRequestSubject, report)).Returns(Task.FromResult<PublishAck>(null));

            // Act
            await _reportWorker.StartAsync(CancellationToken.None); // Start the worker

            // Let the worker run for a short time (simulating asynchronous behavior)
            await Task.Delay(100);

            // Assert
            _jetStreamMock.Verify(j => j.PublishAsync(ReportRequestSubject, report), Times.AtLeastOnce);

            // Cleanup
            await _reportWorker.StopAsync(CancellationToken.None); // Stop the worker
        }

        [Test]
        public async Task OnReportRequestReceived_ShouldPublishReport()
        {
            // Arrange
            var messageMock = new Mock<Msg>();
            messageMock.SetupProperty(m => m.Data, Encoding.UTF8.GetBytes("Test"));

            var args = new MsgHandlerEventArgs(messageMock.Object);

            var report = Encoding.UTF8.GetBytes("TestReport");

            _parcelDeliveryRepositoryMock.Setup(r => r.GetSum()).Returns(100m);
            _jetStreamMock.Setup(j => j.PublishAsync(ReportRequestSubject, report)).Returns(Task.FromResult<PublishAck>(null));

            // Act
            await InvokePrivateMethodAsync("OnReportRequestReceived", args);

            // Assert
            _jetStreamMock.Verify(j => j.PublishAsync(ReportRequestSubject, report), Times.Once);
            _loggerMock.Verify(l => l.LogInformation("Received a manual report generation request"), Times.Once);
            messageMock.Verify(m => m.Ack(), Times.Once);
        }

        private async Task InvokePrivateMethodAsync(string methodName, params object[] parameters)
        {
            var methodInfo = typeof(ReportWorker).GetMethod(methodName, System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            if (methodInfo == null)
            {
                throw new ArgumentException($"Method '{methodName}' not found.");
            }
            await (Task)methodInfo.Invoke(_reportWorker, parameters);
        }
        
        private void VerifyLogger(LogLevel logLevel, string expectedMessage)
        {
            _loggerMock.Verify(
                x => x.Log(
                    logLevel,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString().Contains(expectedMessage)),
                    It.IsAny<Exception>(),
                    (Func<It.IsAnyType, Exception, string>)It.IsAny<object>()
                ),
                Times.Once
            );
        }


    }
}
