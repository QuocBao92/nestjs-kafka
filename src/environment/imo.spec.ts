import * as fs from "fs";

import { IMOConfig } from "./imo";

describe(IMOConfig.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("constructor()", () => {
    it("should init default values when env/config files do not exist", () => {
      // arrage

      const expected = {
        imoRetailBaseUrl: expect.any(String),
        imoOrderBaseUrl: expect.any(String),
        imoCitBaseUrl: expect.any(String),
        imoOrderReportBaseUrl: expect.any(String),
        imoCalendarBaseUrl: expect.any(String),
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(undefined);

      // act
      const actual = new IMOConfig();

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init default values when config file do not have gConnect params", () => {
      // arrage
      const expected = {
        imoRetailBaseUrl: expect.any(String),
        imoOrderBaseUrl: expect.any(String),
        imoCitBaseUrl: expect.any(String),
        imoOrderReportBaseUrl: expect.any(String),
        imoCalendarBaseUrl: expect.any(String),
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify({}));

      // act
      const actual = new IMOConfig();

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init values from config file", () => {
      // arrage
      const config = {
        imo: {
          imoRetailBaseUrl: "http://userAuthBaseUrl:1111",
          imoOrderBaseUrl: "http://userAuthBaseUrl:2222",
          imoCitBaseUrl: "http://userAuthBaseUrl:3333",
          imoOrderReportBaseUrl: "http://userAuthBaseUrl:4444",
          imoCalendarBaseUrl: "http://userAuthBaseUrl:5555",
        },
      };

      const expected = {
        imoRetailBaseUrl: "http://userAuthBaseUrl:1111",
        imoOrderBaseUrl: "http://userAuthBaseUrl:2222",
        imoCitBaseUrl: "http://userAuthBaseUrl:3333",
        imoOrderReportBaseUrl: "http://userAuthBaseUrl:4444",
        imoCalendarBaseUrl: "http://userAuthBaseUrl:5555",
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(config));

      // act
      const actual = new IMOConfig();

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init values from specified config file", () => {
      // arrage
      const config = {
        imo: {
          imoRetailBaseUrl: "http://userAuthBaseUrl:1111",
          imoOrderBaseUrl: "http://userAuthBaseUrl:2222",
          imoCitBaseUrl: "http://userAuthBaseUrl:3333",
          imoOrderReportBaseUrl: "http://userAuthBaseUrl:4444",
          imoCalendarBaseUrl: "http://userAuthBaseUrl:5555",
        },
      };

      const env = {
        IMO_CONFIG_PATH: "from-env-config-path",
      };

      const expected = {
        imoRetailBaseUrl: "http://userAuthBaseUrl:1111",
        imoOrderBaseUrl: "http://userAuthBaseUrl:2222",
        imoCitBaseUrl: "http://userAuthBaseUrl:3333",
        imoOrderReportBaseUrl: "http://userAuthBaseUrl:4444",
        imoCalendarBaseUrl: "http://userAuthBaseUrl:5555",
      };

      jest.spyOn(fs, "readFileSync").mockImplementation(p => {
        if (p === env.IMO_CONFIG_PATH) {
          return JSON.stringify(config);
        }
        throw new Error("error des");
      });

      // act
      const actual = new IMOConfig(env);

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init values from env prior to config file", () => {
      // arrage
      const config = {
        gConnect: {
          imoRetailBaseUrl: "localhost",
          imoOrderReportBaseUrl: "localhost",
        },
      };

      const env = {
        IMO_RETAIL_BASE_URL: "http://userAuthBaseUrl:1111",
        IMO_ORDER_BASE_URL: "http://userAuthBaseUrl:2222",
        IMO_CIT_BASE_URL: "http://userAuthBaseUrl:3333",
        IMO_ORDER_REPORT_BASE_URL: "http://userAuthBaseUrl:4444",
        IMO_CALENDAR_BASE_URL: "http://userAuthBaseUrl:5555",
      };

      const expected = {
        imoRetailBaseUrl: "http://userAuthBaseUrl:1111",
        imoOrderBaseUrl: "http://userAuthBaseUrl:2222",
        imoCitBaseUrl: "http://userAuthBaseUrl:3333",
        imoOrderReportBaseUrl: "http://userAuthBaseUrl:4444",
        imoCalendarBaseUrl: "http://userAuthBaseUrl:5555",
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(config));

      // act
      const actual = new IMOConfig(env);

      // assert
      expect(actual).toEqual(expected);
    });
  });
});
