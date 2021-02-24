import { Module } from "@nestjs/common";


import { RestResponseManagerService } from "./rest-response-manager.service";

@Module({
  providers: [RestResponseManagerService],
  exports: [RestResponseManagerService],
})
export class RestResponseManagerServiceModule {}
