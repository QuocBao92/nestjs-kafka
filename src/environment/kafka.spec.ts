import { KafkaConfig, SaslMechanism } from "./kafka";
import * as fs from "fs";

describe("KafkaConfig", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("constructor()", () => {
    beforeEach(() => {
      const realProcess = process;
      global.process = { ...realProcess, exit: jest.fn() as any };
    })

    it("should exit process when config file doesn't exist", () => {
      // arrage
      jest.spyOn(fs, "readFileSync").mockImplementation(() => { throw {}});

      // act
      new KafkaConfig();

      // assert
      expect(process.exit).toHaveBeenCalledWith(-1);
    });

    it("should init default values when env/config files do not exist", () => {
      // arrage
      const expected = {
        consumerTopic: "TEST-KAFKA",
        producerTopic: "TEST-KAFKA",
        clientId: "test-kafka",
        brokers: [],
        groupId: "test-kafka",
        sasl: {
          mechanism: SaslMechanism.PLAIN,
          username: "",
          password: "",
        },
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(undefined);

      // act
      const actual = new KafkaConfig();

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init default values when env/config files do not exist", () => {
      // arrage
      const expected = {
        consumerTopic: "TEST-KAFKA",
        producerTopic: "TEST-KAFKA",
        clientId: "test-kafka",
        brokers: [],
        groupId: "test-kafka",
        sasl: {
          mechanism: SaslMechanism.PLAIN,
          username: "",
          password: "",
        },
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(undefined);

      // act
      const actual = new KafkaConfig();

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init default values when config file do not have kafka params", () => {
      // arrage
      const expected = {
        consumerTopic: "TEST-KAFKA",
        producerTopic: "TEST-KAFKA",
        clientId: "test-kafka",
        brokers: [],
        groupId: "test-kafka",
        sasl: {
          mechanism: SaslMechanism.PLAIN,
          username: "",
          password: "",
        },
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify({}));

      // act
      const actual = new KafkaConfig();

      // assert
      expect(actual).toEqual(expected);
    });


    it("should init values from specified config file", () => {
      // arrage
      const config = {
        kafka: {
          consumerTopic: "MESSAGING",
          producerTopic: "MESSAGING",
          clientId: "imo-b",
          brokers: [
            "broker"
          ],
          groupId: "imo-b",
          saslMechanism: SaslMechanism.SHA256,
          saslUsername: "username",
          saslPassword: "password",
        },
      };

      const env = {
        KAFKA_CONFIG_PATH: "from-env-config-path",
      };

      const expected = {
        consumerTopic: "MESSAGING",
        producerTopic: "MESSAGING",
        clientId: "imo-b",
        brokers: [
          "broker"
        ],
        groupId: "imo-b",
        sasl: {
          mechanism: SaslMechanism.SHA256,
          username: "username",
          password: "password",
        },
      };

      jest.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (p === env.KAFKA_CONFIG_PATH) {
          return JSON.stringify(config);
        }
        throw new Error("error des");
      });

      // act
      const actual = new KafkaConfig(env);

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init values from env prior to config file", () => {
      // arrage
      const config = {
        kafka: {
          consumerTopic: "MESSAGING",
          producerTopic: "MESSAGING",
          clientId: "imo-b",
          brokers: [
            "broker"
          ],
          groupId: "imo-b",
          saslMechanism: SaslMechanism.SHA256,
          saslUsername: "username",
          saslPassword: "password",
        },
      };

      const env = {
        KAFKA_CONSUMER_TOPIC: "ENV_MESSAGING",
        KAFKA_PRODUCER_TOPIC: "ENV_MESSAGING",
        KAFKA_CLIENT_ID: "imo",
        KAFKA_GROUP_ID: "imo",
        SASL_MACHANISM: SaslMechanism.SHA512,
        SASL_USERNAME: "user",
        SASL_PASSWORD: "pass",
      };

      const expected = {
        consumerTopic: "ENV_MESSAGING",
        producerTopic: "ENV_MESSAGING",
        clientId: "imo",
        brokers: [
          "broker"
        ],
        groupId: "imo",
        sasl: {
          mechanism: SaslMechanism.SHA512,
          username: "user",
          password: "pass",
        },
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(config));

      // act
      const actual = new KafkaConfig(env);

      // assert
      expect(actual).toEqual(expected);
    });
  });
});
