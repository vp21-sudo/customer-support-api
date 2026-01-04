import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { resourceFromAttributes } from "@opentelemetry/resources";

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": "assisthub-backend",
  }),
  logRecordProcessor: new BatchLogRecordProcessor(
    new OTLPLogExporter({
      url: "https://us.i.posthog.com/i/v1/logs",
      headers: {
        Authorization: `Bearer ${process.env.PUBLIC_POSTHOG_KEY}`,
      },
    }),
  ),
});

sdk.start();
