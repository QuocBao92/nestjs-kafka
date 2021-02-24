import { Test, TestingModule } from "@nestjs/testing";
import { of, throwError } from "rxjs";

import { KafkaInterceptor } from "./interceptor";
import { ExecutionContext } from "@nestjs/common";
import { KafkaConsumerMessageGuard } from "./kafka-consumer.guard";

class KafkaInterceptorLoggerServiceMock {
  public request = jest.fn();
  public response = jest.fn();
  public fail = jest.fn();
}

describe(KafkaInterceptor.name, () => {
  let interceptor: KafkaInterceptor;
  let guard: KafkaConsumerMessageGuard;

  class MockKafkaConsumerMessageGuard {
    public isKafkaConsumerMessage = jest.fn();
  }

  beforeEach(async () => {
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaInterceptor, { provide: KafkaConsumerMessageGuard, useClass: MockKafkaConsumerMessageGuard }],
    }).compile();

    interceptor = module.get(KafkaInterceptor);
    guard = module.get(KafkaConsumerMessageGuard);
  });

  it("should be defined", () => {
    expect(interceptor).toBeDefined();
  });

  describe(KafkaInterceptor.prototype.intercept.name, () => {
    it("should call logger.request, main process, logger.response", () => {
      // arrange
      guard.isKafkaConsumerMessage = jest.fn(() => true) as any;
      const template = {
        rid: "1234",
        topic: "test topic",
        payload: { rid: "1234" },
      };
      Date.now = jest.fn(() => 5678);

      // act
      const context = {
        getArgByIndex: (a: number) => {
          if (a === 1)
            return {
              getTopic: () => template.topic,
              getMessage: () => ({
                value: { rid: "1234" },
              }),
            };
        },
      };
      const next = {
        handle: jest.fn(() => of(null)),
      };
      const actual$ = interceptor.intercept(context as ExecutionContext, next).toPromise();

      // assert
      return actual$
        .then(() => {
          const expected = {
            request: {
              rid: template.rid,
              topic: template.topic,
              payload: template.payload,
            },
            resposne: {
              rid: template.rid,
              startTime: 5678,
              endTime: 5678,
              topic: template.topic,
              payload: template.payload,
            },
          };
          expect(next.handle).toHaveBeenCalled();
        })
        .catch((e) => fail(e));
    });

    it("should call logger.fail when error occured", () => {
      // arrange
      guard.isKafkaConsumerMessage = jest.fn(() => true) as any;
      const template = {
        rid: "1234",
        topic: "test topic",
        payload: { rid: "1234" },
        error: { status: 123, message: "test Error" },
      };
      Date.now = jest.fn(() => 5678);

      // act
      const context = {
        getArgByIndex: (a: number) => {
          if (a === 1)
            return {
              getTopic: () => template.topic,
              getMessage: () => ({
                value: { rid: "1234" },
              }),
            };
        },
      };
      const next = {
        handle: jest.fn(() => throwError(template.error)),
      };
      const actual$ = interceptor.intercept(context as ExecutionContext, next).toPromise();

      // assert
      return actual$
        .then(() => {
          const expected = {
            request: {
              rid: template.rid,
              topic: template.topic,
              payload: template.payload,
            },
            fail: {
              rid: template.rid,
              startTime: 5678,
              endTime: 5678,
              topic: template.topic,
              payload: template.payload,
              error: template.error,
            },
          };
          expect(next.handle).toHaveBeenCalled();
        })
        .catch((e) => fail(e));
    });

    it("should do nothing if payload is invalid", () => {
      guard.isKafkaConsumerMessage = jest.fn(() => false) as any;
      const template = {
        rid: "1234",
        topic: "test topic",
        payload: { rid: "1234" },
        error: { status: 123, message: "test Error" },
      };
      const context = {
        getArgByIndex: (a: number) => {
          if (a === 1)
            return {
              getTopic: () => template.topic,
              getMessage: () => ({
                value: { rid: "1234" },
              }),
            };
        },
      };
      const next = {
        handle: jest.fn(() => throwError(template.error)),
      };

      return interceptor
        .intercept(context as ExecutionContext, next)
        .toPromise()
        .then(() => {
          expect(next.handle).not.toHaveBeenCalled();
        });
    });
  });
});
