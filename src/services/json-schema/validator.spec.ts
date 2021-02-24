jest.mock("ajv");

import * as Ajv from "ajv";

import { SchemaUtility, SchemaValidator } from ".";
import { JsonSchema } from "./validator.i";

describe("validator", () => {
  let stubAjv: jest.Mocked<Ajv.Ajv>;

  beforeEach(() => {
    jest.restoreAllMocks();
    stubAjv = new Ajv() as jest.Mocked<Ajv.Ajv>;
    (Ajv.prototype.constructor as jest.Mock).mockImplementation(() => stubAjv);
  });

  describe("SchemaValidator", () => {
    let validator: SchemaValidator;

    beforeEach(() => {
      validator = new SchemaValidator();
    });

    describe("validate", () => {
      const schema: JsonSchema = { $id: "name" };
      const data = "some data";

      it("should validate data", () => {
        // arrange

        // act
        validator.validate(schema, data);

        // assert
        expect(stubAjv.validate).toHaveBeenCalledWith(schema, data);
      });

      it("should return true when validate is passed", () => {
        // arrange
        stubAjv.validate.mockReturnValue(true);

        // act
        const actual = validator.validate(schema, data);

        // assert
        expect(actual).toBeTruthy();
      });

      it("should return false when validate is not passed", () => {
        // arrange
        stubAjv.validate.mockReturnValue(false);

        // act
        const actual = validator.validate(schema, data);

        // assert
        expect(actual).toBeFalsy();
      });
    });
  });

  describe("SchemaUtility", () => {
    beforeEach(() => {
      delete SchemaUtility.validator;
    });

    describe("getSchemaValidator()", () => {
      it("should return SchemaValidator instance", () => {
        // arrange

        // act
        const actual = SchemaUtility.getSchemaValidator();

        // assert
        expect(actual).toBeInstanceOf(SchemaValidator);
      });

      it("should return single object even if called multi times", () => {
        // arrange

        // act
        const actual1 = SchemaUtility.getSchemaValidator();
        const actual2 = SchemaUtility.getSchemaValidator();

        // assert
        expect(actual1).toBe(actual2);
      });
    });
  });
});
