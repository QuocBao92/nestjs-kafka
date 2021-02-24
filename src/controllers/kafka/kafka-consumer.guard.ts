import { Injectable } from "@nestjs/common";

import { JsonSchema, SchemaUtility } from "../../services/json-schema";

import { KafkaCommonInterface, KafkaConsumerEventName } from "./kafka-consumer.i";

@Injectable()
export class KafkaConsumerMessageGuard {
  public isKafkaConsumerMessage(params: any): params is KafkaCommonInterface {
    const schema: JsonSchema = {
      $id: `kafka-${KafkaConsumerMessageGuard.name}.${this.isKafkaConsumerMessage.name}`,
      type: "object",
      properties: {
        value: {
          type: "object",
          properties: {
            rid: {
              type: "string",
              // format: "uuid",
            },
            eventName: {
              type: "string",
              enum: [
                KafkaConsumerEventName.ORDER_GET_LIST_RESULT,
                KafkaConsumerEventName.CREATE_ORDER_START_RESULT,
                KafkaConsumerEventName.CREATE_ORDER_SAVE_RESULT,
                KafkaConsumerEventName.ORDER_REQUEST_RESULT,
                KafkaConsumerEventName.PRINT_ORDER_CREATE_RESULT,
                KafkaConsumerEventName.CIT_DELETE_RESULT,
                KafkaConsumerEventName.CIT_CREATE_RESULT,
                KafkaConsumerEventName.CIT_UPDATE_RESULT,
                KafkaConsumerEventName.CALENDAR_CREATE_RESULT,
                KafkaConsumerEventName.CALENDAR_UPDATE_RESULT,
                KafkaConsumerEventName.CALENDAR_DELETE_RESULT,
                KafkaConsumerEventName.TEST_KAFKA_RESULT,
              ],
            },
          },
          required: ["rid", "eventName"],
        },
      },
    };

    return SchemaUtility.getSchemaValidator().validate(schema, params);
  }
}
