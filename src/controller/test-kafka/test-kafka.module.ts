import { Module } from "@nestjs/common";
import { KafkaProducerModule } from "../../services/kafka-producer";
import { TestKafkaController } from "./test-kafka.controller";

@Module({
  controllers: [TestKafkaController],
  imports: [KafkaProducerModule],
})
export class TestKafkaModule {}
