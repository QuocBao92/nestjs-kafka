import { ImoDatabaseServerError, ErrorCode } from "./error";

describe("ImoDatabaseServerError", () => {
  const errorClassName = "ImoDatabaseServerError";

  describe("isImoDatabaseServerError", () => {
    [
      {
        title: "object created via new",
        input: new ImoDatabaseServerError(0, "message"),
        expected: true,
      },
      {
        title: "object created via new with original error",
        input: new ImoDatabaseServerError(1, "msg", new Error("original")),
        expected: true,
      },
      {
        title: "valid object created manually",
        input: { name: errorClassName, code: 2, message: "created manually" },
        expected: true,
      },
      {
        title: "object with invalid name",
        input: {
          name: "SomeInvalidError",
          code: 3,
          message: `it's not ${errorClassName}`,
        },
        expected: false,
      },
      {
        title: "object without name",
        input: { code: 4, message: `Like a ${errorClassName}, but no name` },
        expected: false,
      },
      {
        title: "object with null name",
        input: { name: null, code: 5, message: "Error name is null" },
        expected: false,
      },
      {
        title: "object with undefined name",
        input: { name: undefined, code: 6, message: "name is undefined" },
        expected: false,
      },
      {
        title: "object without code",
        input: { name: errorClassName, message: "no code" },
        expected: false,
      },
      {
        title: "object with null code",
        input: { name: errorClassName, code: null, message: "code is null" },
        expected: false,
      },
      {
        title: "object with undefined code",
        input: {
          name: errorClassName,
          code: undefined,
          message: "code is undefined",
        },
        expected: false,
      },
      {
        title: "object without message",
        input: { name: errorClassName, code: 10 },
        expected: false,
      },
      {
        title: "object with null message",
        input: { name: errorClassName, code: 11, message: null },
        expected: false,
      },
      {
        title: "object with undefined message",
        input: { name: errorClassName, code: 12, message: undefined },
        expected: false,
      },
      { title: "string", input: "It's just string!", expected: false },
      { title: "number", input: 14, expected: false },
      { title: "array", input: ["It's", "an", "array"], expected: false },
      { title: "null", input: null, expected: false },
      { title: "undefined", input: undefined, expected: false },
    ].forEach(testCase => {
      it(`should return ${testCase.expected} when input is ${testCase.title}`, () => {
        // arrange

        // act
        const actual = ImoDatabaseServerError.isImoDatabaseServerError(testCase.input);

        // assert
        expect(actual).toBe(testCase.expected);
      });
    });
  });

  describe("toString", () => {
    it("should return formatted string", () => {
      // arrange
      const target = new ImoDatabaseServerError(1, "message", {
        error: "original",
      });

      // act
      const actual = target.toString();

      // assert
      expect(actual).toBe(`${target.name}: 1 message`);
    });
  });
});

describe("ErrorCode", () => {
  describe("categorize()", () => {
    it("should return argument as-is if argument is instance of AssetImoDatabaseServerError", () => {
      // arrage
      const expected = new ImoDatabaseServerError(ErrorCode.NOT_FOUND, "asset service error des");

      // act
      const actual = ErrorCode.categorize(expected);

      // assert
      expect(actual).toBe(expected);
    });

    // ----------------------
    // test switch statement
    [
      { code: ErrorCode.INTERNAL, message: "original", originalError: null },
      { code: ErrorCode.INTERNAL, message: "original" },
    ].forEach(c => {
      it(`should return error code ${c.code} if ${c.message} error.code is ${c.originalError} `, () => {
        // arrage
        const error = c.originalError;
        const expected = c.code;

        // act
        const target = ErrorCode.categorize(error);
        const actual = target.code;

        // assert
        expect(actual).toBe(expected);
      });
    });
  });
});
