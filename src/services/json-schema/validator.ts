import * as ajv from "ajv";

import { JsonSchema } from "./validator.i";

// --------------------------------------------------------------------------

export class SchemaValidator {
  constructor(public ajv = new ajv()) {}

  public validate(schema: JsonSchema, data: any): boolean {
    const valid = this.ajv.validate(schema, data);
    if (!valid) {
      console.log(this.ajv.errorsText(), valid);
      return false;
    }

    return true;
  }
}

export class SchemaUtility {
  public static validator: SchemaValidator | null;

  public static getSchemaValidator(ajv?: ajv.Ajv) {
    if (!this.validator) {
      this.validator = new SchemaValidator(ajv);
    }

    return this.validator;
  }
}
