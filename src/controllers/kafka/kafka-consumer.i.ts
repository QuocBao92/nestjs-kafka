import { KafkaConfig } from "../../environment/kafka";

export const topic = new KafkaConfig().consumerTopic;

export enum KafkaConsumerEventName {
  ORDER_GET_LIST_RESULT = "order-get-list-result",
  CREATE_ORDER_START_RESULT = "create-order-start-result",
  CREATE_ORDER_SAVE_RESULT = "create-order-save-result",
  ORDER_REQUEST_RESULT = "order-request-result",
  PRINT_ORDER_CREATE_RESULT = "print-order-create-result",
  CIT_DELETE_RESULT = "cit-delete-result",
  CIT_CREATE_RESULT = "cit-create-result",
  CIT_UPDATE_RESULT = "cit-update-result",
  CALENDAR_CREATE_RESULT = "calendar-create-result",
  CALENDAR_UPDATE_RESULT = "calendar-update-result",
  CALENDAR_DELETE_RESULT = "calendar-delete-result",
  TEST_KAFKA_RESULT = "test-kafka-result",
}

export enum KafkaConsumerResult {
  SUCCESS = "success",
  FAILURE = "failure",
}

export interface KafkaCommonMessage {
  rid: string;
  eventName: KafkaConsumerEventName;
}

export interface KafkaCommonInterface<T = KafkaCommonMessage> {
  magicByte: number;
  attributes: number;
  timestamp: number;
  offset: number;
  key: string | null;
  value: T;
  headers: any;
  isControlRecord: boolean;
  batchContext: {
    firstOffset: number;
    firstTimestamp: number;
    partitionLeaderEpoch: number;
    inTransaction: boolean;
    isControlBatch: boolean;
    lastOffsetDelta: number;
    producerId: number;
    producerEpoch: number;
    firstSequence: number;
    maxTimestamp: number;
    magicByte: number;
  };
  topic: string;
  partition: number;
  time: Date;
  v: number;
}
