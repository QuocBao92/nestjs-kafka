import { KafkaCommonInterface, KafkaCommonMessage } from "./kafka-consumer.i";

export type GetApiInfoMessageResult = KafkaCommonInterface<
  KafkaCommonMessage & {
    data: {
      method: string;
      path: string;
    };
  }
>;
