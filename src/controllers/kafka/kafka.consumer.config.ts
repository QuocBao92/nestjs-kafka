import { Transport, KafkaOptions } from "@nestjs/microservices";
import { logLevel } from "@nestjs/microservices/external/kafka.interface";

import { KafkaConfig } from "../../environment/kafka";
import { AppConfig } from "../../environment/app";

export class KafkaConsumerConfig {
  private readonly options: {name: string} & KafkaOptions;

  constructor(production: boolean = new AppConfig().production) {
    const kafka = new KafkaConfig();

    this.options = {
      name: "KAFKA_CONSUMER",
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: kafka.clientId,
          brokers: kafka.brokers,
          ssl: production,
          sasl: production ? kafka.sasl : undefined,
          logLevel: production ? logLevel.ERROR : logLevel.INFO,
        },
        consumer: {
          // adding random number becuase each bff don't belong to same consumer group
          groupId: `${kafka.groupId}-${this.makeRandomNumber(8)}`,
        },
      }
    };
  }

  public get(): {name: string} & KafkaOptions {
    return this.options;
  }

  makeRandomNumber(length: number) {
    return Math.random().toString(36).substring(length);
  }
}
