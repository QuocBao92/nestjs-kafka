import { Module } from "@nestjs/common";

import { RestControllerModule } from "./controllers/rest-api/rest-controller.module";
import { KafkaConsumerModule } from "./controllers/kafka/kafka-consumer.module";
import { AppConfig } from "./environment/app";

import { ForDebugModule } from "./for-debug/for-debug.module";

const DebugModules = new AppConfig().production ? [] : [ForDebugModule];

@Module({
  imports: [RestControllerModule, KafkaConsumerModule, ...DebugModules],
})
export class AppModule {}
