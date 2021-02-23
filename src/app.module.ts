import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TestKafkaModule } from "./controller/test-kafka/test-kafka.module";
import { KafkaProducerModule } from "./services/kafka-producer";

@Module({
  imports: [TestKafkaModule, KafkaProducerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
