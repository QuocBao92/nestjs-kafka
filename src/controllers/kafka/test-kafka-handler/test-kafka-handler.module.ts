import { Module } from "@nestjs/common";
import { RestResponseManagerServiceModule } from "../../../services/rest-response-manager";
import { TestKafkaHandler } from "./test-kafka-handler.controller";

@Module({
  imports: [RestResponseManagerServiceModule],
  providers: [TestKafkaHandler],
  exports: [TestKafkaHandler],
})
export class TestKafkaHandlerModule {}
