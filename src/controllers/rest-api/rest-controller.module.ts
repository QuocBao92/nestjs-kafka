import { Module } from "@nestjs/common";
import { TestKafkaModule } from "./test-kafka/test-kafka.module";

// -------------------------------------

@Module({
  imports: [TestKafkaModule],
})
export class RestControllerModule {}
