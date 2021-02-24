import { TestingModule, Test } from "@nestjs/testing";
import { GuardKafka } from "./kafka.handler.guard";

describe(GuardKafka.name, () => {
  let guard: GuardKafka;

  beforeEach(async () => {
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardKafka],
    }).compile();

    guard = module.get(GuardKafka);
  });

  describe(GuardKafka.prototype.isGetApiInfoMessageResult.name, () => {
    [
      {
        title: "return true when data is correct",
        input: {
          data: {
            method: "GET",
            path: "http://localhost/test",
          },
        },
        expected: true,
      },
      {
        title: "return false when data items is undefined",
        input: {
          data: undefined,
        },
        expected: false,
      },
      {
        title: "return false when data items is not array",
        input: {
          data: "",
        },
        expected: false,
      },
      {
        title: "return false when orderNumber doesn't exist",
        input: {
          data: {},
        },
        expected: false,
      },
      {
        title: "return false when method doesn't exist",
        input: {
          data: {
            path: "http://localhost/test",
          },
        },
        expected: false,
      },
      {
        title: "return false when path doesn't exist",
        input: {
          data: {
            method: "GET",
          },
        },
        expected: false,
      },
    ].forEach(tc => {
      it(tc.title, () => {
        // arrange

        // act
        const actual = guard.isGetApiInfoMessageResult(tc.input);

        // assert
        expect(actual).toEqual(tc.expected);
      });
    });
  });
});
