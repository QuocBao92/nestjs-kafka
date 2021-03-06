import { Transport, KafkaOptions } from "@nestjs/microservices";

import { logLevel } from "@nestjs/microservices/external/kafka.interface";

import { KafkaConfig } from "../../environment/kafka";
import { AppConfig } from "../../environment/app";

export class KafkaProducerConfig {
  private readonly options: { name: string } & KafkaOptions;

  constructor(production: boolean = new AppConfig().production) {
    const kafka = new KafkaConfig();

    this.options = {
      name: "KAFKA_PRODUCER",
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: kafka.clientId,
          brokers: kafka.brokers,
          ssl: production,
          sasl: production ? kafka.sasl : undefined,
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
