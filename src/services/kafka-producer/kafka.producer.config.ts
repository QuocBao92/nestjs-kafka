import { Transport, KafkaOptions } from "@nestjs/microservices";

import { logLevel } from "@nestjs/microservices/external/kafka.interface";
import { KafkaConfig } from "../../enviroment/kafka";

export class KafkaProducerConfig {
  private readonly options: { name: string } & KafkaOptions;

  constructor(production = true) {
    const kafka = new KafkaConfig();

    this.options = {
      name: "KAFKA_PRODUCER",
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: kafka.clientId,
          brokers: kafka.brokers,
          ssl: kafka.ssl,
          sasl: kafka.ssl ? kafka.sasl : undefined,
          logLevel: production ? logLevel.ERROR : logLevel.INFO,
        },
        producer: {
          allowAutoTopicCreation: false,
          idempotent: false,
        },
      },
    };
  }

  public get(): { name: string } & KafkaOptions {
    return this.options;
  }
}
