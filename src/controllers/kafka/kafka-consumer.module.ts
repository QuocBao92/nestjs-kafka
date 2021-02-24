import { Module } from "@nestjs/common";
import { KafkaMessageController } from "./kafka-consumer";
import { KafkaConsumerMessageGuard } from "./kafka-consumer.guard";
import { TestKafkaHandlerModule } from "./test-kafka-handler/test-kafka-handler.module";

// -------------------------------------

@Module({
  controllers: [KafkaMessageController],
  providers: [KafkaConsumerMessageGuard],
  imports: [TestKafkaHandlerModule],
})
export class KafkaConsumerModule {}
