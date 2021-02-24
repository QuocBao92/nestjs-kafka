import { NestFactory } from "@nestjs/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";

import { AppConfig } from "../environment/app";
import { KafkaConsumerConfig } from "../controllers/kafka/kafka.consumer.config";

export class App {
  public static async start(module: any) {
    const app = await NestFactory.create(module);
    await App.setup(app);
  }

  public static async setup(app: INestApplication) {
    // main app
    const appConfig = new AppConfig();
    // app.useLogger(commonLogger);

    app.enableCors({
      origin: appConfig.frontend,
      allowedHeaders: "*",
    });

    // kafka consumer
    app.connectMicroservice(new KafkaConsumerConfig().get());

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(appConfig.port);
    await app.startAllMicroservicesAsync();

    console.log(
      `${appConfig.appName}:${appConfig.version} listening the port http://${process.env.HOSTNAME || "localhost"}:${appConfig.port}`,
    );
  }
}
