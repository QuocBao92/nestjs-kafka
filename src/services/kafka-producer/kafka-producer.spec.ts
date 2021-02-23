import { TestingModule, Test } from "@nestjs/testing";

import { KafkaProducerService } from "./kafka-producer.service";
import { INestMicroservice } from "@nestjs/common/interfaces";
import { KafkaClientLoggerService } from "@glory-iot-dev/common-logger";
import { of, throwError } from "rxjs";

class MockClientKafka {
  public connect = jest.fn();
  public close = jest.fn();
  public emit = jest.fn();
}
class MockKafkaClientLoggerService {
  public publish = jest.fn();
  public success = jest.fn();
  public fail = jest.fn();
}

describe(KafkaProducerService.name, () => {
  let microservice: INestMicroservice;
  let service: KafkaProducerService;
  let logger: KafkaClientLoggerService;

  beforeEach(async () => {
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaProducerService,
        { provide: "KAFKA_PRODUCER", useClass: MockClientKafka },
        { provide: KafkaClientLoggerService, useClass: MockKafkaClientLoggerService },
      ],
    }).compile();

    microservice = module.createNestMicroservice({});
    service = module.get(KafkaProducerService);
    logger = module.get(KafkaClientLoggerService);
  });

  afterAll(() => {
    microservice.close();
  });

  it("should initialize", () => {
    expect(service).toBeTruthy();
  });

  describe(KafkaProducerService.prototype.onModuleInit.name, () => {
    it("should let client make connection with broker when initializing this service", async () => {
      // act
      await microservice.init();

      // assert
      expect(service.client.connect).toHaveBeenCalled();
    });
  });

  describe(KafkaProducerService.prototype.onModuleDestroy.name, () => {
    it("should let client close connection with broker when destroying this service", async () => {
      // act
      await microservice.init();
      await microservice.close();

      // assert
      expect(service.client.close).toHaveBeenCalled();
    });
  });

  describe(KafkaProducerService.prototype.send.name, () => {
    it("should emit data to the specified topic", () => {
      // arrange
      const topic = "topic";
      const data = { rid: "data" };
      const reqParams = {
        rid: data.rid,
      };
      Date.now = jest.fn(() => new Date(Date.UTC(2017, 1, 14)).valueOf());
      const startTime = Date.now();
      const response = {};

      jest.spyOn(service.client, "emit").mockReturnValue(of(response));

      return service
        .send(topic, data)
        .toPromise()
        .then(response => {
          // assert
          expect(logger.publish).toHaveBeenCalledWith(reqParams, topic, data, "");
          expect(service.client.emit).toHaveBeenCalledWith(topic, data);
          expect(logger.success).toHaveBeenCalledWith(reqParams, startTime, Date.now(), topic, data, response);
        })
        .catch(fail);
    });

    it("should log fail if emit data error", () => {
      // arrange
      const topic = "topic";
      const data = { rid: "data" };
      const reqParams = {
        rid: data.rid,
      };
      Date.now = jest.fn(() => new Date(Date.UTC(2017, 1, 14)).valueOf());
      const startTime = Date.now();

      const error = new Error("error");
      jest.spyOn(service.client, "emit").mockReturnValue(throwError(error));

      return service
        .send(topic, data)
        .toPromise()
        .then(() => {
          expect(logger.fail).toHaveBeenCalledWith(reqParams, startTime, Date.now(), topic, data, error);
        })
        .catch(fail);
    });
  });
});
