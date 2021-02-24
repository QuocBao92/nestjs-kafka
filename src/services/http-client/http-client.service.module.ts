import { Module, HttpModule } from "@nestjs/common";

import { HttpClientService } from "./http-client.service";

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientServiceModule {}
