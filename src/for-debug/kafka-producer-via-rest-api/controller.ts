import { Controller, Get, HttpCode } from "@nestjs/common";

import { KafkaProducerService } from "../../services/kafka-producer/kafka-producer.service";
import { topic, KafkaProducerEventName } from "../../services/kafka-producer/kafka.producer.i";
import { rid } from "../constant";

@Controller("/kafka-debug")
export class KafkaDebugController {
  constructor(private kafka: KafkaProducerService) {}

  @Get()
  @HttpCode(200)
  public getAsset() {
    console.log(`Enter GET /kafka-debug`);

    this.kafka.send(topic, { rid, eventName: KafkaProducerEventName.TEST_KAFKA });
  }
}
