import { KafkaCommonInterface, KafkaCommonMessage } from "../kafka-consumer.i";

export type TestKafkaResult = KafkaCommonInterface<
  KafkaCommonMessage & {
    result: string;
    data: {
      calendarId: string;
    };
  }
>;
