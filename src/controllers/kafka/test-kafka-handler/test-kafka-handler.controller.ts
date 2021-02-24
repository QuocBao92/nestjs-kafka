import { Injectable } from "@nestjs/common";
import { RestResponseManagerService } from "../../../services/rest-response-manager/rest-response-manager.service";
import { KafkaConsumerEventName, KafkaConsumerResult } from "../kafka-consumer.i";
import { TestKafkaResult } from "./test-kafka-handler.i";

@Injectable()
export class TestKafkaHandler {
  constructor(private restResponseManager: RestResponseManagerService) {}

  public handleCreateResult(payload: TestKafkaResult) {
    if (!this.restResponseManager.checkAddressedToYou(payload.value.rid)) {
      return;
    }

    console.log(`Enter handler of ${KafkaConsumerEventName.TEST_KAFKA_RESULT}`);

    // if (!this.guard.isCreateOrUpdateResult(payload.value)) {
    //   this.logger.info("Invalid message", payload);
    //   return this.restResponseManager.notifyInvalidResponse(payload.value.rid, new Error("invalid response data"));
    // }

    if (payload.value.result == KafkaConsumerResult.FAILURE) {
      return this.restResponseManager.notifyInvalidResponse(payload.value.rid, new Error("failure"));
    }

    return this.restResponseManager.notifyResponse(payload.value.rid, payload.value.data);
  }
}
