import { Injectable } from "@nestjs/common/decorators";
import { AppConfig } from "src/enviroment/app";
import { RedisConfig } from "src/enviroment/redis";

@Injectable()
export class ConfigService {
  private readonly app: AppConfig;
  private readonly redis: RedisConfig;

  public constructor() {
    this.app = new AppConfig();
    this.redis = new RedisConfig();
  }

  public appConfig(): AppConfig {
    return this.app;
  }

  public redisConfig() {
    return {
      connectionInfo: {
        host: this.redis.host,
        port: this.redis.port,
        db: this.redis.db,
        username: this.redis.username,
        password: this.redis.password,
      },
      sessionInfo: {
        secret: this.redis.sessionSecret,
        resave: false,
        saveUninitialized: false,
        proxy: this.redis.sessionProxy,
        enableTtl: this.redis.enableTtl,
        ttl: this.redis.ttl,
        cookie: {
          domain: this.redis.sessionDomain,
          path: "/",
          httpOnly: this.redis.sessionHttpOnly,
          secure: this.redis.sessionSecure,
          sameSite: this.redis.sessionSameSite,
        },
      },
    };
  }
}
