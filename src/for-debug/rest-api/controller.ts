import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("/rest-debug")
export class RestDebugController {
  constructor() {}

  @Get()
  @HttpCode(200)
  public get() {
    console.log(`Enter GET /rest-debug`);
  }
}
