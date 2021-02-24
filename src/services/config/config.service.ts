import { Injectable } from "@nestjs/common/decorators";
import { AppConfig } from "../../environment/app";

@Injectable()
export class ConfigService {
  private readonly app: AppConfig;

  public constructor() {
    this.app = new AppConfig();
  }

  public appConfig(): AppConfig {
    return this.app;
  }
}
