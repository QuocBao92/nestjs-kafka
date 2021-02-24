import * as fs from "fs";
import * as path from "path";
import { SASLOptions } from "@nestjs/microservices/external/kafka.interface";

export interface IEnv {
  KAFKA_CONFIG_PATH?: string;
  KAFKA_CONSUMER_TOPIC?: string;
  KAFKA_PRODUCER_TOPIC?: string;
  KAFKA_CLIENT_ID?: string;
  KAFKA_GROUP_ID?: string;
  SASL_MACHANISM?: SaslMechanism;
  SASL_USERNAME?: string;
  SASL_PASSWORD?: string;
}

export interface IConf {
  consumerTopic?: string;
  producerTopic?: string;
  clientId?: string;
  brokers?: string[];
  groupId?: string;
  saslMechanism?: SaslMechanism;
  saslUsername?: string;
  saslPassword?: string;
}

export enum SaslMechanism {
  PLAIN = "plain",
  SHA256 = "scram-sha-256",
  SHA512 = "scram-sha-512",
  AWS = "aws",
  OAUTH_BEARER = "oauthbearer",
}

export class KafkaConfig implements IConf {
  public static readonly defaultCconfigFile = path.join(__dirname, "../assets/conf/app-config.json");
  public static readonly configName = "kafka";

  public consumerTopic = "TEST-KAFKA";
  public producerTopic = "TEST-KAFKA";
  public clientId = "test-kafka";
  public brokers = [];
  public groupId = "test-kafka";
  public sasl: SASLOptions = {
    mechanism: SaslMechanism.PLAIN,
    username: "",
    password: "",
  };

  constructor(env: IEnv = process.env) {
    let conf: IConf = {};

    try {
      conf = JSON.parse(fs.readFileSync(env.KAFKA_CONFIG_PATH || KafkaConfig.defaultCconfigFile, "utf-8"))[KafkaConfig.configName] || {};
    } catch (e) {
      console.log(e.stack);
      process.exit(-1);
    }

    this.consumerTopic = env.KAFKA_CONSUMER_TOPIC || conf.consumerTopic || this.consumerTopic;
    this.producerTopic = env.KAFKA_PRODUCER_TOPIC || conf.producerTopic || this.producerTopic;
    this.clientId = env.KAFKA_CLIENT_ID || conf.clientId || this.clientId;
    this.brokers = conf.brokers || this.brokers;
    this.groupId = env.KAFKA_GROUP_ID || conf.groupId || this.groupId;
    this.sasl.mechanism = env.SASL_MACHANISM || conf.saslMechanism || this.sasl.mechanism;
    try {
      switch (this.sasl.mechanism) {
        case SaslMechanism.PLAIN:
        case SaslMechanism.SHA256:
        case SaslMechanism.SHA512:
          this.sasl.username = env.SASL_USERNAME || conf.saslUsername || this.sasl.username;
          this.sasl.password = env.SASL_PASSWORD || conf.saslPassword || this.sasl.password;
          break;
        case SaslMechanism.AWS:
        case SaslMechanism.OAUTH_BEARER:
          throw Error("unsupported mechanism for kafka connection");
      }
    } catch (error) {}
  }
}
