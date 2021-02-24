import { Module } from "@nestjs/common";

import { KafkaDebugController } from "./controller";
import { KafkaProducerModule } from "../../services/kafka-producer/kafka-producer.module";

@Module({
  controllers: [KafkaDebugController],
  imports: [KafkaProducerModule],
})
export class KafkaDebugModule {}
