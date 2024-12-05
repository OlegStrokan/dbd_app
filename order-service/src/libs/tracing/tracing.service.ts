import { BatchSpanProcessor, SimpleSpanProcessor, SpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import * as process from 'process';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

@Module({})
export class OpenTelemetryModule implements OnModuleInit, OnModuleDestroy {
    private otelSDK: NodeSDK;

    constructor() {
        const jaegerExporter = new OTLPTraceExporter({
            url: 'http://localhost:14268/api/traces',
        });
        const traceExporter = jaegerExporter;

        const spanProcessor: SpanProcessor = (
            process.env.NODE_ENV === 'development'
                ? new SimpleSpanProcessor(traceExporter)
                : new BatchSpanProcessor(traceExporter)
        ) as SpanProcessor;

        this.otelSDK = new NodeSDK({
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: 'nestjs-otel',
            }),
            //@ts-ignore
            spanProcessor: spanProcessor,
            instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation(), new NestInstrumentation()],
        });
    }

    async onModuleInit() {
        try {
            await this.otelSDK.start();
            console.log('OpenTelemetry SDK initialized');
        } catch (err) {
            console.error('Error starting OpenTelemetry SDK', err);
        }
    }

    async onModuleDestroy() {
        try {
            await this.otelSDK.shutdown();
            console.log('OpenTelemetry SDK shut down successfully');
        } catch (err) {
            console.error('Error shutting down OpenTelemetry SDK', err);
        }
    }
}
