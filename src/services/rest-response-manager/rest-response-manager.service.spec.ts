import { TestingModule, Test } from "@nestjs/testing";

import { RestResponseManagerService } from "./rest-response-manager.service";
import { CommonLoggerService } from "@glory-iot-dev/common-logger";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs";

describe(RestResponseManagerService.name, () => {
  let module: TestingModule;
  let service: RestResponseManagerService;

  class LoggerServiceMock {
    public trace = jest.fn();
    public debug = jest.fn();
    public info = jest.fn();
    public warn = jest.fn();
    public error = jest.fn();
    public fatal = jest.fn();
  }

  beforeEach(async () => {
    jest.restoreAllMocks();

    module = await Test.createTestingModule({
      providers: [RestResponseManagerService, { provide: CommonLoggerService, useClass: LoggerServiceMock }],
    }).compile();

    service = module.get(RestResponseManagerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("judge whether rid is in list", () => {
    it("should judge existing", () => {
      // arrange
      const rid = "00000000-0000-0000-0000-000000000000";

      // act
      service.waitResponse$(rid, () => {}).subscribe();

      // assert
      expect(service.checkAddressedToYou(rid)).toEqual(true);
    });

    it("should judge not existing", () => {
      // arrange
      const rid = "00000000-0000-0000-0000-000000000000";
      const dummyId = "11111111-1111-1111-1111-111111111111";

      // act
      service.waitResponse$(rid, () => {}).subscribe();

      // assert
      expect(service.checkAddressedToYou(dummyId)).toEqual(false);
    });
  });

  describe("notify response to caller", () => {
    it("should notify response when response is judged valid", () => {
      // arrange
      const rid = "00000000-0000-0000-0000-000000000000";
      const res = { data: "data" };

      // assert
      service
        .waitResponse$(rid, () => {})
        .pipe(
          tap(d => {
            expect(d).toEqual(res);
          }),
          catchError(e => fail(e)),
        )
        .subscribe();

      // act
      service.notifyResponse(rid, res);
    });

    it("should notify error when response is judged invalid", () => {
      // arrange
      const rid = "00000000-0000-0000-0000-000000000000";
      const error = "error";

      // assert
      service
        .waitResponse$(rid, () => {})
        .pipe(
          tap(() => fail("unexpected here")),
          catchError(e => {
            expect(e).toEqual(error);
            return of();
          }),
        )
        .subscribe();

      // act
      service.notifyInvalidResponse(rid, error);
    });
  });
});
