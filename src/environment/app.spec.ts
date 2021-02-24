import { AppConfig } from "./app";
import * as fs from "fs";

describe("postgres", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("constructor()", () => {
    it("should init default values when env/config files do not exist", () => {
      // arrage
      const expected = {
        appName: expect.any(String),
        frontend: "http://localhost:4200",
        version: expect.stringMatching(/^[0-9]+\.[0-9]+\.[0-9]+$/),
        port: 3000,
        production: true,
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(undefined);

      // act
      const actual = new AppConfig({});

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init default values when config file do not have app params", () => {
      // arrage
      const expected = {
        appName: expect.any(String),
        frontend: "http://localhost:4200",
        version: expect.stringMatching(/^[0-9]+\.[0-9]+\.[0-9]+$/),
        port: 3000,
        production: true,
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify({}));

      // act
      const actual = new AppConfig({});

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init values from config file", () => {
      // arrage
      const config = {
        app: {
          port: 12345,
          production: false,
          frontend: "https://bff"
        },
      };

      const expected = {
        appName: expect.any(String),
        frontend: "https://bff",
        version: expect.stringMatching(/^[0-9]+\.[0-9]+\.[0-9]+$/),
        port: 12345,
        production: false,
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(config));

      // act
      const actual = new AppConfig();

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init values from specified config file", () => {
      // arrage
      const config = {
        app: {
          port: 5555,
          frontend: "https://bff"
        },
      };

      const env = {
        APP_CONFIG_PATH: "from-env-config-path",
      };

      const expected = {
        appName: expect.any(String),
        frontend: "https://bff",
        version: expect.stringMatching(/^[0-9]+\.[0-9]+\.[0-9]+$/),
        port: 5555,
        production: true,
      };

      jest.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (p === env.APP_CONFIG_PATH) {
          return JSON.stringify(config);
        }
        throw new Error("error des");
      });

      // act
      const actual = new AppConfig(env);

      // assert
      expect(actual).toEqual(expected);
    });

    it("should init values from env prior to config file", () => {
      // arrage
      const config = {
        app: {
          port: 5555,
          production: true,
        },
      };

      const env = {
        SERVER_PORT: "6666",
        PRODUCTION: "false",
        FRONTEND_DOMAIN: "https://bff"
      };

      const expected = {
        appName: expect.any(String),
        frontend: "https://bff",
        version: expect.stringMatching(/^[0-9]+\.[0-9]+\.[0-9]+$/),
        port: 6666,
        production: false,
      };

      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(config));

      // act
      const actual = new AppConfig(env);

      // assert
      expect(actual).toEqual(expected);
    });
  });
});
