import ConnectRedis from "connect-redis";
import session from "express-session";
import { RedisModule, RedisModuleOptions, RedisService } from "nestjs-redis";
import { NestSessionOptions, SessionModule } from "nestjs-session";
import { ConfigService, ConfigServiceModule } from "../config";

export const RedisSessionModule = SessionModule.forRootAsync({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): RedisModuleOptions => {
        const redis = config.redisConfig().connectionInfo;

        return {
          host: redis.host,
          port: redis.port,
          db: redis.db,
          username: redis.username,
          password: redis.password,
        };
      },
    }),
    ConfigServiceModule,
  ],
  inject: [RedisService, ConfigService],
  useFactory: (redisService: RedisService, config: ConfigService): NestSessionOptions => {
    const RedisStore = ConnectRedis(session);
    const redisClient = redisService.getClient().on("error", (e) => console.log("Redis Error:" + e));
    const redisSession = config.redisConfig().sessionInfo;

    return {
      session: {
        store: new RedisStore({
          client: redisClient,
          prefix: "",
          disableTTL: !redisSession.enableTtl,
          ttl: redisSession.ttl,
        }),
        secret: redisSession.secret,
        resave: redisSession.resave,
        saveUninitialized: redisSession.saveUninitialized,
        proxy: redisSession.proxy,
        cookie: {
          domain: redisSession.cookie.domain,
          path: redisSession.cookie.path,
          httpOnly: redisSession.cookie.httpOnly,
          secure: redisSession.cookie.secure,
          sameSite: redisSession.cookie.sameSite,
        },
      },
    };
  },
});
