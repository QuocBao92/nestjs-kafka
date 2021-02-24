import { KafkaConsumerMessageGuard } from "./kafka-consumer.guard";
import { KafkaConsumerEventName } from "./kafka-consumer.i";
import { Test, TestingModule } from "@nestjs/testing";

describe(KafkaConsumerMessageGuard.name, () => {
  let guard: KafkaConsumerMessageGuard;

  beforeEach(async () => {
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaConsumerMessageGuard],
    }).compile();

    guard = module.get(KafkaConsumerMessageGuard);
  });

  [
    {
      title: "should return true when data is correct",
      input: {
        value: { rid: "00000000-0000-0000-0000-000000000000", eventName: KafkaConsumerEventName.CALENDAR_UPDATE_RESULT },
      },
      expected: true,
    },
  ].forEach(testCase => {
    it(testCase.title, () => {
      expect(guard.isKafkaConsumerMessage(testCase.input)).toEqual(testCase.expected);
    });
  });

  [
    // rid
    {
      title: "should return false when data doesn't have rid",
      input: { value: { eventName: KafkaConsumerEventName.CALENDAR_UPDATE_RESULT } },
      expected: false,
    },
    {
      title: "should return false when eventName is not uuid",
      input: { value: { rid: "1", eventName: KafkaConsumerEventName.CALENDAR_UPDATE_RESULT } },
      expected: false,
    },
    {
      title: "should return false when eventName is not string",
      input: { value: { rid: 1, eventName: KafkaConsumerEventName.CALENDAR_UPDATE_RESULT } },
      expected: false,
    },

    // eventName
    {
      title: "should return false when data doesn't have eventName",
      input: { value: { rid: "00000000-0000-0000-0000-000000000000" } },
      expected: false,
    },
    {
      title: "should return false when eventName is not in enumeration",
      input: { value: { rid: "00000000-0000-0000-0000-000000000000", eventName: "Invalid" } },
      expected: false,
    },
  ].forEach(testCase => {
    it(testCase.title, () => {
      expect(guard.isKafkaConsumerMessage(testCase.input)).toEqual(testCase.expected);
    });
  });
});
