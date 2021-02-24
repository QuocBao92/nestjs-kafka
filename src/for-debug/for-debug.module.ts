import { Module } from "@nestjs/common";

import { KafkaDebugModule } from "./kafka-producer-via-rest-api/controller.module";
import { RestDebugModule } from "./rest-api/controller.module";

// -------------------------------------

@Module({
  imports: [
    KafkaDebugModule,
    RestDebugModule,
  ]
})
export class ForDebugModule {}
