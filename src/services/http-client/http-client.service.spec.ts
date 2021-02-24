import { Test, TestingModule } from "@nestjs/testing";

import { HttpClientService, external } from "./http-client.service";
import { HttpService } from "@nestjs/common";
import { of, throwError } from "rxjs";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpClientLoggerService } from "@glory-iot-dev/common-logger";
import * as utilsLib from "@glory-iot-dev/common-logger";

describe("HttpClientService", () => {
  let service: HttpClientService;
  let http: HttpService;
  let logger: HttpClientLoggerService;

  class HttpClientLoggerServiceMock {
    public request = jest.fn();
    public success = jest.fn();
    public fail = jest.fn();
  }

  class HttpServiceMock {
    public get = jest.fn(() => of());
    public post = jest.fn(() => of());
    public delete = jest.fn(() => of());
  }

  beforeEach(async () => {
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpClientService,
        { provide: HttpService, useClass: HttpServiceMock },
        { provide: HttpClientLoggerService, useClass: HttpClientLoggerServiceMock },
      ],
    }).compile();

    service = module.get(HttpClientService);
    http = module.get(HttpService);
    logger = module.get(HttpClientLoggerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  describe("get$", () => {
    it("should leave log about executing http request", () => {
      // arrange
      const path = "";
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      (external.getSid as jest.Mock) = jest.fn(() => 1);
      // act
      return service
        .get$(reqParams, path)
        .toPromise()
        .then(() => {
          const expected = {
            reqParams: reqParams,
            sid: 1,
            method: "GET",
            path,
            config: undefined,
          };
          expect(logger.request).toHaveBeenCalledWith(...Object.values(expected));
        })
        .catch(e => fail(e));
    });

    it("should call HttpService.get of Nestjs service with path and config", () => {
      // arrange
      const path = "/path";
      const config: AxiosRequestConfig = { timeout: 5000 };
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "get").mockReturnValueOnce(of());

      // act
      return service
        .get$(reqParams, path, config)
        .toPromise()
        .then(() => expect(http.get).toHaveBeenCalledWith(path, config))
        .catch(() => fail("test error"));
    });

    it("should call logger.request when succeeding request", () => {
      const path = "/path";
      const res = { status: 200 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "get").mockReturnValueOnce(of(res));
      (external.getSid as jest.Mock) = jest.fn(() => 1);
      // act
      return service
        .get$(reqParams, path)
        .toPromise()
        .then(() => {
          const expected = {
            reqParams: reqParams,
            sid: 1,
            method: "GET",
            path,
            config: undefined,
          };
          expect(logger.request).toHaveBeenCalledWith(...Object.values(expected));
        })
        .catch(() => fail("test error"));
    });

    it("should return normal response when succeeding request", () => {
      const path = "/path";
      const res = { status: 200 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "get").mockReturnValueOnce(of(res));

      // act
      return service
        .get$(reqParams, path)
        .toPromise()
        .then(r => expect(r).toEqual(res))
        .catch(() => fail("test error"));
    });

    it("should call logger.error with requestCount when failing request", () => {
      const path = "/path";
      const res = { status: 500 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      (external.getSid as jest.Mock) = jest.fn(() => 1);
      Date.now = jest.fn(() => new Date(Date.UTC(2017, 1, 14)).valueOf());
      const startTime = Date.now();
      jest.spyOn(http, "get").mockReturnValueOnce(throwError(res));

      // act
      return service
        .get$(reqParams, path)
        .toPromise()
        .then(() => fail("test error"))
        .catch(() => {
          const expected = {
            reqParams: reqParams,
            sid: 1,
            startTime: startTime,
            endTime: Date.now(),
            method: "GET",
            path: "/path",
            response: {
              status: 500,
            },
          };
          expect(logger.fail).toHaveBeenCalledWith(
            expected.reqParams,
            expected.sid,
            expected.startTime,
            expected.endTime,
            expected.method,
            expected.path,
            expected.response,
          );
        });
    });

    it("should return error response when failing request", () => {
      const path = "/path";
      const res = { status: 500 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "get").mockReturnValueOnce(throwError(res));

      // act
      return service
        .get$(reqParams, path)
        .toPromise()
        .then(() => fail("test error"))
        .catch(e => expect(e).toEqual(res));
    });
  });

  describe("post$", () => {
    it("should leave log about executing http request", () => {
      // arrange
      const path = "";
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      (external.getSid as jest.Mock) = jest.fn(() => 1);
      // act
      return service
        .post$(reqParams, path)
        .toPromise()
        .then(() => {
          const expected = {
            reqParams: reqParams,
            sid: 1,
            method: "POST",
            path,
            config: undefined,
            data: undefined,
          };
          expect(logger.request).toHaveBeenCalledWith(...Object.values(expected));
        })
        .catch(e => fail(e));
    });

    it("should call HttpService.post of Nestjs service with path and config", () => {
      // arrange
      const path = "/path";
      const data = {};
      const config: AxiosRequestConfig = { timeout: 5000 };
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "post").mockReturnValueOnce(of());

      // act
      return service
        .post$(reqParams, path, data, config)
        .toPromise()
        .then(() => expect(http.post).toHaveBeenCalledWith(path, data, config))
        .catch(() => fail("test error"));
    });

    it("should call logger.request with requestCount when succeeding request", () => {
      const path = "/path";
      const res = { status: 200 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "post").mockReturnValueOnce(of(res));
      (external.getSid as jest.Mock) = jest.fn(() => 1);
      // act
      return service
        .post$(reqParams, path)
        .toPromise()
        .then(() => {
          const expected = {
            reqParams: reqParams,
            sid: 1,
            method: "POST",
            path,
            data: undefined,
            config: undefined,
          };
          expect(logger.request).toHaveBeenCalledWith(...Object.values(expected));
        })
        .catch(e => fail(e));
    });

    it("should return normal response when succeeding request", () => {
      const path = "/path";
      const res = { status: 201 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "post").mockReturnValueOnce(of(res));

      // act
      return service
        .post$(reqParams, path)
        .toPromise()
        .then(r => expect(r).toEqual(res))
        .catch(() => fail("test error"));
    });

    it("should call logger.error with requestCount when failing request", () => {
      const path = "/path";
      const res = { status: 500 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      Date.now = jest.fn(() => new Date(Date.UTC(2017, 1, 14)).valueOf());
      const startTime = Date.now();
      jest.spyOn(http, "post").mockReturnValueOnce(throwError(res));
      (external.getSid as jest.Mock) = jest.fn(() => 1);
      // act
      return service
        .post$(reqParams, path)
        .toPromise()
        .then(() => fail("test error"))
        .catch(() => {
          const expected = {
            reqParams: reqParams,
            sid: 1,
            startTime: startTime,
            endTime: Date.now(),
            method: "POST",
            path: "/path",
            response: {
              status: 500,
            },
            data: undefined,
          };
          expect(logger.fail).toHaveBeenCalledWith(...Object.values(expected));
        });
    });

    it("should return normal response when succeeding request", () => {
      const path = "/path";
      const res = { status: 500 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "post").mockReturnValueOnce(throwError(res));

      // act
      return service
        .post$(reqParams, path)
        .toPromise()
        .then(() => fail("test error"))
        .catch(e => expect(e).toEqual(res));
    });
  });

  describe("delete$", () => {
    it("should leave log about executing http request", () => {
      // arrange
      const path = "";
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      (external.getSid as jest.Mock) = jest.fn(() => 1);

      // act
      return service
        .delete$(reqParams, path)
        .toPromise()
        .then(() => {
          const expected = {
            reqParams: reqParams,
            sid: 1,
            method: "DELETE",
            path,
            config: undefined,
          };
          expect(logger.request).toHaveBeenCalledWith(...Object.values(expected));
        })
        .catch(e => fail(e));
    });

    it("should call HttpService.delete of Nestjs service with path and config", () => {
      // arrange
      const path = "/path";
      const config: AxiosRequestConfig = { timeout: 5000 };
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "delete").mockReturnValueOnce(of());

      // act
      return service
        .delete$(reqParams, path, config)
        .toPromise()
        .then(() => expect(http.delete).toHaveBeenCalledWith(path, config))
        .catch(() => fail("test error"));
    });

    it("should call logger.success with requestCount when succeeding request", () => {
      const path = "/path";
      const res = { status: 200 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      Date.now = jest.fn(() => new Date(Date.UTC(2017, 1, 14)).valueOf());
      const startTime = Date.now();
      jest.spyOn(http, "delete").mockReturnValueOnce(of(res));
      (external.getSid as jest.Mock) = jest.fn(() => 1);

      // act
      return service
        .delete$(reqParams, path)
        .toPromise()
        .then(() => {
          const expected = {
            reqParams: reqParams,
            sid: 1,
            startTime: startTime,
            endTime: Date.now(),
            method: "DELETE",
            path,
            response: {
              status: 200,
            },
          };
          expect(logger.success).toHaveBeenCalledWith(...Object.values(expected));
        })
        .catch(e => fail(e));
    });

    it("should return normal response when succeeding request", () => {
      const path = "/path";
      const res = { status: 201 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "delete").mockReturnValueOnce(of(res));

      // act
      return service
        .delete$(reqParams, path)
        .toPromise()
        .then(r => expect(r).toEqual(res))
        .catch(() => fail("test error"));
    });

    it("should call logger.error with requestCount when failing request", () => {
      const path = "/delete";
      const res = { status: 500 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      Date.now = jest.fn(() => new Date(Date.UTC(2017, 1, 14)).valueOf());
      const startTime = Date.now();
      jest.spyOn(http, "delete").mockReturnValueOnce(throwError(res));
      (external.getSid as jest.Mock) = jest.fn(() => 1);

      jest.fn(() => {});

      // act
      return service
        .delete$(reqParams, path)
        .toPromise()
        .then(() => fail("test error"))
        .catch(() => {
          const expected = {
            reqParams: reqParams,
            sid: 1,
            startTime: startTime,
            endTime: Date.now(),
            method: "DELETE",
            path: "/delete",
            response: {
              status: 500,
            },
          };
          expect(logger.fail).toHaveBeenCalledWith(
            expected.reqParams,
            expected.sid,
            expected.startTime,
            expected.endTime,
            expected.method,
            expected.path,
            expected.response,
          );
        });
    });

    it("should return normal response when succeeding request", () => {
      const path = "/path";
      const res = { status: 500 } as AxiosResponse;
      const reqParams: utilsLib.RequestParams = {
        rid: 1,
      };
      jest.spyOn(http, "delete").mockReturnValueOnce(throwError(res));

      // act
      return service
        .delete$(reqParams, path)
        .toPromise()
        .then(() => fail("test error"))
        .catch(e => expect(e).toEqual(res));
    });
  });
});
