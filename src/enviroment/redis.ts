import * as _fs from "fs";
import * as path from "path";

export const fs = { ..._fs };

// from process env
export interface IEnv {
  REDIS_CONFIG_PATH?: string;
  REDIS_ENABLED?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  REDIS_DB?: number;
  REDIS_USER_NAME?: string;
  REDIS_PASSWORD?: string;
  REDIS_ENABLE_TTL?: string;
  REDIS_TTL?: number;
  SESSION_DOMAIN?: string;
  SESSION_SECRET?: string;
  SESSION_PROXY?: string;
  SESSION_HTTP_ONLY?: string;
  SESSION_SECURE?: string;
  SESSION_SAME_SITE?: string;
}

export interface IConf {
  enabled?: boolean;
  host?: string;
  port?: number;
  db?: number;
  username?: string;
  password?: string;
  enableTtl?: boolean;
  ttl?: number;
  sessionDomain?: string;
  sessionSecret?: string;
  sessionProxy?: boolean;
  sessionHttpOnly?: boolean;
  sessionSecure?: "auto" | boolean;
  sessionSameSite?: "lax" | "strict" | "none" | boolean;
}

export class RedisConfig {
  public static readonly defaultConfigFile = path.join(__dirname, "../assets/conf/app-config.json");
  public static readonly configName = "redis";

  public enabled = true;
  public host = "localhost";
  public port = 6379;
  public db = 0;
  public username = "";
  public password = "";
  public enableTtl = false;
  public ttl = 86400;
  public sessionDomain = "localhost";
  public sessionSecret = "GLORY LTD.";
  public sessionProxy = false;
  public sessionHttpOnly = false;
  public sessionSecure: "auto" | boolean = false;
  public sessionSameSite: "lax" | "strict" | "none" | boolean = false;

  /**
   * Parses config files and process env.
   */
  constructor(env: IEnv = process.env) {
    let conf: IConf = {};

    try {
      const content = fs.readFileSync(env.REDIS_CONFIG_PATH || RedisConfig.defaultConfigFile, "utf-8");
      conf = JSON.parse(content)[RedisConfig.configName] || {};
    } catch {}

    this.enabled = env.REDIS_ENABLED === "true" ? true : env.REDIS_ENABLED === "false" ? false : conf.enabled || this.enabled;
    this.host = env.REDIS_HOST || conf.host || this.host;
    this.port = Number(env.REDIS_PORT) || conf.port || this.port;
    this.db = Number(env.REDIS_DB) || conf.db || this.db;
    this.username = env.REDIS_USER_NAME || conf.username || this.username;
    this.password = env.REDIS_PASSWORD || conf.password || this.password;
    this.enableTtl = env.REDIS_ENABLE_TTL === "true" ? true : env.REDIS_ENABLE_TTL === "false" ? false : conf.enableTtl || this.enableTtl;
    this.ttl = Number(env.REDIS_TTL) || conf.ttl || this.ttl;
    this.sessionDomain = env.SESSION_DOMAIN || conf.sessionDomain || this.sessionDomain;
    this.sessionSecret = env.SESSION_SECRET || conf.sessionSecret || this.sessionSecret;
    this.sessionHttpOnly =
      env.SESSION_HTTP_ONLY === "true" ? true : env.SESSION_HTTP_ONLY === "false" ? false : conf.sessionHttpOnly || this.sessionHttpOnly;
    this.sessionProxy =
      env.SESSION_PROXY === "true" ? true : env.SESSION_PROXY === "false" ? false : conf.sessionProxy || this.sessionProxy;
    this.sessionSecure =
      env.SESSION_SECURE === "true"
        ? true
        : env.SESSION_SECURE === "false"
        ? false
        : env.SESSION_SECURE === "auto"
        ? "auto"
        : conf.sessionSecure || this.sessionSecure;
    this.sessionSameSite =
      env.SESSION_SAME_SITE === "true"
        ? true
        : env.SESSION_SAME_SITE === "false"
        ? false
        : env.SESSION_SAME_SITE === "strict"
        ? "strict"
        : env.SESSION_SAME_SITE === "lax"
        ? "lax"
        : env.SESSION_SAME_SITE === "none"
        ? "none"
        : conf.sessionSameSite || this.sessionSameSite;
  }
}
