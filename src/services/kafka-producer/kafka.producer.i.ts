import { KafkaConfig } from "../../environment/kafka";

export const topic = new KafkaConfig().producerTopic;

export enum KafkaProducerEventName {
  TEST_KAFKA = "test-kafka",
}
