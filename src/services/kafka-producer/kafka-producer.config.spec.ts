import { Transport } from "@nestjs/microservices/enums";

import { logLevel } from "@nestjs/microservices/external/kafka.interface";
import { KafkaConfig } from "../../enviroment/kafka";
import { KafkaProducerConfig } from "./kafka.producer.config";

describe(KafkaProducerConfig.name, () => {
  let config: KafkaProducerConfig;

  describe(KafkaProducerConfig.prototype.get.name, () => {
    it("should get kafka config: production and ssl on", () => {
      process.env["KAFKA_SSL"] = "true";
      const kafka = new KafkaConfig();

      config = new KafkaProducerConfig(true);

      const expected = {
        name: "KAFKA_PRODUCER",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: kafka.clientId,
            brokers: kafka.brokers,
            ssl: kafka.ssl,
            sasl: kafka.sasl,
            logLevel: logLevel.ERROR,
          },
          producer: {
            allowAutoTopicCreation: false,
            idempotent: false,
          },
        },
      };

      expect(config.get()).toEqual(expected);
    });

    it("should get kafka config: development and ssl off", () => {
      process.env["KAFKA_SSL"] = "false";
      const kafka = new KafkaConfig();

      config = new KafkaProducerConfig(false);

      const expected = {
        name: "KAFKA_PRODUCER",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: kafka.clientId,
            brokers: kafka.brokers,
            ssl: kafka.ssl,
            sasl: undefined,
            logLevel: logLevel.INFO,
          },
          producer: {
            allowAutoTopicCreation: false,
            idempotent: false,
          },
        },
      };

      expect(config.get()).toEqual(expected);
    });
  });
});
