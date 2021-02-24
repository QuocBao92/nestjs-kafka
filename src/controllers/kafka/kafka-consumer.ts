import { Controller, UseInterceptors } from "@nestjs/common/decorators/core";
import { EventPattern, Payload } from "@nestjs/microservices";
import { KafkaInterceptor } from "./interceptor";
import { KafkaConsumerMessageGuard } from "./kafka-consumer.guard";
import { KafkaCommonInterface, KafkaConsumerEventName, topic } from "./kafka-consumer.i";
import { TestKafkaHandler } from "./test-kafka-handler/test-kafka-handler.controller";

@Controller()
export class KafkaMessageController {
  constructor(
    private testKafkaHandler: TestKafkaHandler,
    private guard: KafkaConsumerMessageGuard,
  ) {}

  @EventPattern(topic)
  @UseInterceptors(KafkaInterceptor)
  EventRouting(@Payload() payload: KafkaCommonInterface): any {
    // if (!this.guard.isKafkaConsumerMessage(payload)) {
    //  console.log("This message has invalid format", payload);
    //   return;
    // }

    this.EventHandlerMap(payload);
  }

  EventHandlerMap(payload) {
    switch (payload.value.eventName) {
      // test-kafka
      case KafkaConsumerEventName.TEST_KAFKA_RESULT:
        return this.testKafkaHandler.handleCreateResult(payload as any);

      default:
        return this.defaultHandler(payload);
    }
  }

  defaultHandler(payload: KafkaCommonInterface) {
    console.log("This message is unrelated to me", payload);
  }
}
