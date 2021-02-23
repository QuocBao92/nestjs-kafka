import * as _fs from "fs";
import * as path from "path";

export const fs = { ..._fs };

export interface IEnv {
  APP_CONFIG_PATH?: string;
  SERVER_PORT?: string;
  HOSTNAME?: string;
  PRODUCTION?: string;
  FRONTEND_DOMAIN?: string;
}

export interface IConf {
  port?: number;
  appName?: string;
  version?: string;
  production?: boolean;
  frontend?: string;
}

export class AppConfig implements IConf {
  public static readonly defaultCconfigFile = path.join(__dirname, "../assets/conf/app-config.json");
  public static readonly packageJsonPath = path.join(__dirname, "../../package.json");
  public static readonly configName = "app";

  public appName = "test-kafka";
  public version = "0.0.1";
  public port = 3000;
  public production = true;

  constructor(env: IEnv = process.env) {
    let conf: IConf = {};
    let packageJson: { name?: string; version?: string } = {};

    try {
      conf = JSON.parse(fs.readFileSync(env.APP_CONFIG_PATH || AppConfig.defaultCconfigFile, "utf-8"))[AppConfig.configName] || {};
    } catch {}

    try {
      packageJson = JSON.parse(fs.readFileSync(AppConfig.packageJsonPath, "utf-8"));
    } catch {}

    this.port = Number(env.SERVER_PORT || conf.port || this.port);
    this.appName = packageJson.name || this.appName;
    this.version = packageJson.version || this.version;
    this.production = this.isProduction(env, conf);
  }

  public isProduction(e: IEnv, c: IConf): boolean {
    if (typeof e.PRODUCTION === "string") {
      return /^true$/i.test(e.PRODUCTION);
    }

    if (typeof c.production === "boolean") {
      return c.production;
    }

    return this.production;
  }
}
