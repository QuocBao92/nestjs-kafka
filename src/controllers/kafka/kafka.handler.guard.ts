import { Injectable } from "@nestjs/common";
import { JsonSchema, SchemaUtility } from "../../services/json-schema";
import { GetApiInfoMessageResult } from "./kafka.handler.i";

@Injectable()
export class GuardKafka {
  public isGetApiInfoMessageResult(params: any): params is GetApiInfoMessageResult {
    const schema: JsonSchema = {
      $id: `kafka-${GuardKafka.name}.${this.isGetApiInfoMessageResult.name}`,
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            method: {
              type: "string",
              enum: ["GET"],
            },
            path: {
              type: "string",
            },
          },
          required: ["method", "path"],
        },
      },
      required: ["data"],
    };

    return SchemaUtility.getSchemaValidator().validate(schema, params);
  }
}
