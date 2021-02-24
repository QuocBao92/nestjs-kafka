import { Module } from "@nestjs/common";

import { RestDebugController } from "./controller";
import { RestResponseManagerServiceModule } from "../../services/rest-response-manager/rest-response-manager.module";

@Module({
  controllers: [RestDebugController],
  imports: [RestResponseManagerServiceModule],
})
export class RestDebugModule {}
