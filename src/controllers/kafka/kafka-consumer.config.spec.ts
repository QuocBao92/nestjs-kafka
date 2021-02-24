import { Transport } from "@nestjs/microservices/enums";

import { KafkaConfig } from "../../environment/kafka";

import { KafkaConsumerConfig } from "./kafka.consumer.config";
import { logLevel } from "@nestjs/microservices/external/kafka.interface";

describe(KafkaConsumerConfig.name, () => {
  let config: KafkaConsumerConfig;

  describe(KafkaConsumerConfig.prototype.get.name, () => {
    it("should get kafka config: production", () => {
      const kafka = new KafkaConfig();

      config = new KafkaConsumerConfig(true);

      const expected = {
        name: "KAFKA_CONSUMER",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: kafka.clientId,
            brokers: kafka.brokers,
            ssl: true,
            sasl: kafka.sasl,
            logLevel: logLevel.ERROR,
          },
          consumer: {
            groupId: expect.any(String),
          },
        }
      };

      expect(config.get()).toEqual(expected);
    });

    it("should get kafka config: production", () => {
      const kafka = new KafkaConfig();

      config = new KafkaConsumerConfig(false);

      const expected = {
        name: "KAFKA_CONSUMER",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: kafka.clientId,
            brokers: kafka.brokers,
            ssl: false,
            sasl: undefined,
            logLevel: logLevel.INFO,
          },
          consumer: {
            groupId: expect.any(String),
          },
        }
      };

      expect(config.get()).toEqual(expected);
    });
  });
});
