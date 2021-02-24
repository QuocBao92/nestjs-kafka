import { HttpModule, Module } from "@nestjs/common";
import { ConfigServiceModule } from "../../../services/config";
import { HttpClientServiceModule } from "../../../services/http-client";
import { KafkaProducerModule } from "../../../services/kafka-producer/kafka-producer.module";
import { RestResponseManagerServiceModule } from "../../../services/rest-response-manager/rest-response-manager.module";
import { TestKafkaController } from "./test-kafka.controller";

@Module({
  controllers: [TestKafkaController],
  imports: [
    KafkaProducerModule,
    RestResponseManagerServiceModule,
    ConfigServiceModule,
    HttpClientServiceModule,
    HttpModule.register({
      timeout: 5000,
      proxy: false,
    }),
  ],
})
export class TestKafkaModule {}
