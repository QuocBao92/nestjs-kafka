import { Module } from "@nestjs/common";

import { ClientsModule } from "@nestjs/microservices/module";

import { KafkaProducerConfig } from "./kafka.producer.config";
import { KafkaProducerService } from "./kafka-producer.service";

@Module({
  providers: [KafkaProducerService],
  imports: [ClientsModule.register([new KafkaProducerConfig().get()])],
  exports: [KafkaProducerService],
})
export class KafkaProducerModule {}
