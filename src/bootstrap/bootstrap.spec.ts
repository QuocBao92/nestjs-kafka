import { Test } from "@nestjs/testing";

import { NestFactory } from "@nestjs/core";

import { App } from "./bootstrap";

import { KafkaConsumerConfig } from "../controllers/kafka/kafka.consumer.config";
import { AppConfig } from "../environment/app";

class ShutdownServiceMock {
  public configureGracefulShutdown = jest.fn((func) => func());
  public teardown$ = jest.fn();
}

class NestMicroserviceMock {
  public useGlobalPipes = jest.fn();
}

class NestApplicationMock {
  public connectMicroservice = jest.fn(() => new NestMicroserviceMock());
  public useGlobalPipes = jest.fn();
  public startAllMicroservicesAsync = jest.fn();
  public enableShutdownHooks = jest.fn();
  public shutdownServiceMock = new ShutdownServiceMock();
  public get = jest.fn(() => this.shutdownServiceMock);
  public listen = jest.fn();
  public useLogger = jest.fn();
  public use = jest.fn().mockReturnThis();
  public enableCors = jest.fn()
}

describe(App.name, () => {
  let app;
  let module;

  beforeEach(async () => {
    jest.restoreAllMocks();
    app = new NestApplicationMock();
    module = await Test.createTestingModule({}); // TestModule
  });

  describe(App.start.name, () => {
    it("should call NestFactory.create with AppModule", () => {
      // arrange
      jest.spyOn(NestFactory, "create").mockImplementation(() => new Promise((resolve) => resolve(app)));
      jest.spyOn(App, "setup").mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve();
          }),
      );

      // act
      return App.start(module)
        .then(() => {
          expect(NestFactory.create).toHaveBeenCalledWith(module);
          expect(App.setup).toHaveBeenCalled();
        })
        .catch((e) => fail(e));
    });
  });

  describe(App.setup.name, () => {
    it("should call functions about this app", () => {
      // arrange
      const kafkaConfig = {name: "KAFKA"};
      jest.spyOn(KafkaConsumerConfig.prototype, "get").mockReturnValue(kafkaConfig)

      // act
      return App.setup(app)
        .then(() => {
          expect(app.connectMicroservice).toHaveBeenCalledWith(kafkaConfig)
          expect(app.enableShutdownHooks).toHaveBeenCalled();
          expect(app.listen).toHaveBeenCalled();
          expect(app.shutdownServiceMock.configureGracefulShutdown).toHaveBeenCalled();
          expect(app.shutdownServiceMock.teardown$).toHaveBeenCalledWith(app);
          expect(app.startAllMicroservicesAsync).toHaveBeenCalled();
        })
        .catch((e) => fail(e));
    });

    it("should set cors for frontend", () => {
      // arrange
      const expected = {
        origin: new AppConfig().frontend,
        allowedHeaders: '*',
      };

      return App.setup(app)
      .then(() => {
        expect(app.enableCors).toHaveBeenCalledWith(expected);
      })
      .catch((e) => fail(e));
    });
  });
});
