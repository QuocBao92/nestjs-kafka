import { Test, TestingModule } from "@nestjs/testing";


// router
import { KafkaMessageController } from "./kafka-consumer";
import { KafkaConsumerMessageGuard } from "./kafka-consumer.guard";
import { KafkaConsumerEventName, KafkaCommonInterface } from "./kafka-consumer.i";

// handler
import { ViewOrdersHandler } from "./view-orders-handler/view-orders.handler";
import { CreateOrderHandler } from "./create-order-handler/create-order.handler";
import { PrintOrderHandler } from "./print-order-handler/print-order.handler";
import { ViewCitsHandler } from "./view-cits-handler/view-cits.handler";
import { CreateCitHandler } from "./create-cit-handler/create-cit.handler";
import { CreateCalendarHandler } from "./create-calendar-handler/create-calendar.handler";
import { ViewCalendarHandler } from "./view-calendar-handler/view-calendar.handler";

describe(KafkaMessageController.name, () => {
  let controller: KafkaMessageController;
  let guard: KafkaConsumerMessageGuard;

  let viewOrdersHandler: ViewOrdersHandler;
  let createOrderHandler: CreateOrderHandler;
  let printOrderHandler: PrintOrderHandler;
  let viewCitsHandler: ViewCitsHandler;
  let createCitHandler: CreateCitHandler;
  let createCalendarHandler: CreateCalendarHandler;
  let viewCalendarHandler: ViewCalendarHandler;

  class MockKafkaConsumerMessageGuard {
    isKafkaConsumerMessage = jest.fn();
  }

  class MockCreateOrderHandler {
    handleStartResult = jest.fn();
    handleSelectedLocationResult = jest.fn();
    handleSaveResult = jest.fn();
    handleRequestResult = jest.fn();
  }

  class MockViewCitsHandler {
    handleDeleteResult = jest.fn();
  }

  class MockViewOrdersHandler {
    handleStartResult = jest.fn();
  }

  class MockCreateCitHandler {
    handleGetEntryDefaultResult = jest.fn();
    handleGetDetailResult = jest.fn();
    handleGetRetailerLocationsResult = jest.fn();
    handleCreateResult = jest.fn();
    handleUpdateResult = jest.fn();
  }

  class MockCreateCalendarHandler {
    handleCreateResult = jest.fn();
    handleUpdateResult = jest.fn();
  }

  class MockPrintOrderHandler {
    handleCreateResult = jest.fn();
  }

  class MockViewCalendarHandler {
    handleDeleteResult = jest.fn();
  }
  class LoggerServiceMock {
    public trace = jest.fn();
    public debug = jest.fn();
    public info = jest.fn();
    public warn = jest.fn();
    public error = jest.fn();
    public fatal = jest.fn();
  }

  class MockKafkaInterceptorLoggerService {
    request = jest.fn();
    response = jest.fn();
    fail = jest.fn();
  }

  beforeEach(async () => {
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KafkaMessageController],
      providers: [
        { provide: KafkaConsumerMessageGuard, useClass: MockKafkaConsumerMessageGuard },
        { provide: ViewOrdersHandler, useClass: MockViewOrdersHandler },
        { provide: CreateOrderHandler, useClass: MockCreateOrderHandler },
        { provide: PrintOrderHandler, useClass: MockPrintOrderHandler },
        { provide: ViewCitsHandler, useClass: MockViewCitsHandler },
        { provide: CreateCitHandler, useClass: MockCreateCitHandler },
        { provide: CreateCalendarHandler, useClass: MockCreateCalendarHandler },
        { provide: PrintOrderHandler, useClass: MockPrintOrderHandler },
        { provide: KafkaConsumerMessageGuard, useClass: MockKafkaConsumerMessageGuard },
        { provide: CommonLoggerService, useClass: LoggerServiceMock },
        { provide: ViewOrdersHandler, useClass: MockViewOrdersHandler },
        { provide: ViewCalendarHandler, useClass: MockViewCalendarHandler },
        { provide: KafkaInterceptorLoggerService, useClass: MockKafkaInterceptorLoggerService },
      ],
    }).compile();

    controller = module.get(KafkaMessageController);
    guard = module.get(KafkaConsumerMessageGuard);
    logger = module.get(CommonLoggerService);

    viewOrdersHandler = module.get(ViewOrdersHandler);
    createOrderHandler = module.get(CreateOrderHandler);
    printOrderHandler = module.get(PrintOrderHandler);
    viewCitsHandler = module.get(ViewCitsHandler);
    createCitHandler = module.get(CreateCitHandler);
    createCalendarHandler = module.get(CreateCalendarHandler);
    viewCalendarHandler = module.get(ViewCalendarHandler);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(guard).toBeDefined();
  });

  describe(KafkaMessageController.prototype.EventRouting.name, () => {
    it("should finish when payload is invalid", () => {
      // arrange
      const payload = {};

      jest.spyOn(guard, "isKafkaConsumerMessage").mockImplementation(() => false);
      jest.spyOn(controller, "EventHandlerMap");

      // act
      controller.EventRouting(payload as any);

      // assert
      expect(controller.EventHandlerMap).not.toHaveBeenCalled();
    });

    it("should call handler map when payload is valid", () => {
      const payload = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: "evnet",
        },
      };

      jest.spyOn(guard, "isKafkaConsumerMessage").mockImplementation(() => true);
      jest.spyOn(controller, "EventHandlerMap");

      // act
      controller.EventRouting(payload as any);

      // assert
      expect(controller.EventHandlerMap).toHaveBeenCalled();
    });
  });

  describe(KafkaMessageController.prototype.EventHandlerMap.name, () => {
    // view-orders
    it(`should call correct handler for ${KafkaConsumerEventName.ORDER_GET_LIST_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.ORDER_GET_LIST_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(viewOrdersHandler.handleStartResult).toHaveBeenCalledWith(payload);
    });

    // create-order
    it(`should call correct handler for ${KafkaConsumerEventName.CREATE_ORDER_SAVE_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.CREATE_ORDER_SAVE_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(createOrderHandler.handleSaveResult).toHaveBeenCalledWith(payload);
    });

    it(`should call correct handler for ${KafkaConsumerEventName.ORDER_REQUEST_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.ORDER_REQUEST_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(createOrderHandler.handleRequestResult).toHaveBeenCalledWith(payload);
    });

    it(`should call correct handler for ${KafkaConsumerEventName.PRINT_ORDER_CREATE_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.PRINT_ORDER_CREATE_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(printOrderHandler.handleCreateResult).toHaveBeenCalledWith(payload);
    });

    // view-cits
    it(`should call correct handler for ${KafkaConsumerEventName.CIT_DELETE_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.CIT_DELETE_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(viewCitsHandler.handleDeleteResult).toHaveBeenCalledWith(payload);
    });

    // create/edit-cit
    it(`should call correct handler for ${KafkaConsumerEventName.CIT_CREATE_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.CIT_CREATE_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(createCitHandler.handleCreateResult).toHaveBeenCalledWith(payload);
    });

    it(`should call correct handler for ${KafkaConsumerEventName.CIT_UPDATE_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.CIT_UPDATE_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(createCitHandler.handleUpdateResult).toHaveBeenCalledWith(payload);
    });

    // view-calendars
    it(`should call correct handler for ${KafkaConsumerEventName.CALENDAR_DELETE_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.CALENDAR_DELETE_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(viewCalendarHandler.handleDeleteResult).toHaveBeenCalledWith(payload);
    });

    // create/edit-calendar
    it(`should call correct handler for ${KafkaConsumerEventName.CALENDAR_CREATE_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.CALENDAR_CREATE_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(createCalendarHandler.handleCreateResult).toHaveBeenCalledWith(payload);
    });

    it(`should call correct handler for ${KafkaConsumerEventName.CALENDAR_UPDATE_RESULT}`, () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: KafkaConsumerEventName.CALENDAR_UPDATE_RESULT,
        },
      } as KafkaCommonInterface;

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(createCalendarHandler.handleUpdateResult).toHaveBeenCalledWith(payload);
    });

    it("should call default handler for invalid event", () => {
      const payload: KafkaCommonInterface = {
        value: {
          rid: "00000000-0000-0000-0000-000000000000",
          eventName: "invalid" as any,
        },
      } as KafkaCommonInterface;

      jest.spyOn(controller, "defaultHandler");

      // act
      controller.EventHandlerMap(payload);

      // assert
      expect(controller.defaultHandler).toHaveBeenCalledWith(payload);
    });
  });

  describe(KafkaMessageController.prototype.defaultHandler.name, () => {
    it("should call logger.info", () => {
      // arrange
      const payload = {};

      jest.spyOn(logger, "info");

      // act
      controller.defaultHandler(payload as any);

      // assert
      expect(logger.info).toHaveBeenCalled();
    });
  });
});
