import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "./config.service";
import { AppConfig } from "../../environment/app";
import { IMOConfig } from "../../environment/imo";
import { GConnectConfig } from "../../environment/g-connect";
import { RedisConfig } from "../../environment/redis";
import { UserAuthConfig } from "../../environment/user-auth";

describe(ConfigService.name, () => {
  let service: ConfigService;

  beforeEach(async () => {
    AppConfig.prototype.constructor = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe(ConfigService.prototype.appConfig.name, () => {
    it("should return AppConfig", () => {
      // arrange
      const expected = new AppConfig();

      // act
      const actual = service.appConfig();

      // assert
      expect(actual).toEqual(expected);
    });
  });

  describe(ConfigService.prototype.userAuthConfig.name, () => {
    it("should return UserAuthConfig", () => {
      // arrange
      const expected = new UserAuthConfig();

      // act
      const actual = service.userAuthConfig();

      // assert
      expect(actual).toEqual(expected);
    });
  });

  describe(ConfigService.prototype.imoUrlConfig.name, () => {
    it("should return imoUrlConfig", () => {
      // arrange
      const expected = {
        orderService: {
          orderDetailWithOrderNumber: `${new IMOConfig().imoOrderBaseUrl}/order-detail/{orderNumber}`,
          orders: `${new IMOConfig().imoOrderBaseUrl}/orders`,
          orderStatuses: `${new IMOConfig().imoOrderBaseUrl}/order-statuses`,
          orderCurrencyDenominations: `${new IMOConfig().imoOrderBaseUrl}/order-currency-denominations`,
        },
        citService: {
          cits: `${new IMOConfig().imoCitBaseUrl}/cits`,
          citsWithCitId: `${new IMOConfig().imoCitBaseUrl}/cits/:citId`,
          entryDefault: `${new IMOConfig().imoCitBaseUrl}/entry-default`,
        },
        retailService: {
          companyLocations: `${new IMOConfig().imoRetailBaseUrl}/company-locations`,
          companyLocationsCitRelations: `${new IMOConfig().imoRetailBaseUrl}/company-locations-cit-relations`,
          locations: `${new IMOConfig().imoRetailBaseUrl}/locations`,
        },
        calendarService: {
          entryDefault: `${new IMOConfig().imoCalendarBaseUrl}/entry-default`,
          calendarsWithCalendarId: `${new IMOConfig().imoCalendarBaseUrl}/calendars/{calendarId}`,
          calendars: `${new IMOConfig().imoCalendarBaseUrl}/calendars`,
          holidayCalendars: `${new IMOConfig().imoCalendarBaseUrl}/holiday-calendars`,
          calendarTypes: `${new IMOConfig().imoCalendarBaseUrl}/calendar-types`,
        },
        assetService: {
          assets: `${new IMOConfig().imoAssetBaseUrl}/assets`,
          assetSettingsWithAssetId: `${new IMOConfig().imoAssetBaseUrl}/asset-settings/{assetId}`,
        },
      };

      // act
      const actual = service.imoUrlConfig();

      // assert
      expect(actual).toEqual(expected);
    });
  });

  describe(ConfigService.prototype.redisConfig.name, () => {
    it("should return formatted redisConfig", () => {
      // arrange
      const redis = new RedisConfig();
      const expected = {
        connectionInfo: {
          host: redis.host,
          port: redis.port,
          db: redis.db,
          username: redis.username,
          password: redis.password,
        },
        sessionInfo: {
          secret: redis.sessionSecret,
          resave: false,
          saveUninitialized: false,
          proxy: redis.sessionProxy,
          enableTtl: redis.enableTtl,
          ttl: redis.ttl,
          cookie: {
            domain: redis.sessionDomain,
            path: "/",
            httpOnly: redis.sessionHttpOnly,
            secure: redis.sessionSecure,
            sameSite: redis.sessionSameSite,
          },
        },
      };

      // act
      const actual = service.redisConfig();

      // assert
      expect(actual).toEqual(expected);
    });
  });

  describe(ConfigService.prototype.gConnectConfig.name, () => {
    it("should return GConnectConfig", () => {
      // arrange
      const expected = new GConnectConfig();

      // act
      const actual = service.gConnectConfig();

      // assert
      expect(actual).toEqual(expected);
    });
  });
});
