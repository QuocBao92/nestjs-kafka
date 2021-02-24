import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { RestResponseManagerService } from "src/services/rest-response-manager";
import { KafkaProducerService } from "../../../services/kafka-producer/kafka-producer.service";
import { KafkaProducerEventName, topic } from "../../../services/kafka-producer/kafka.producer.i";

@Controller("")
export class TestKafkaController {
  constructor(private kafkaProducer: KafkaProducerService, private restResponseManager: RestResponseManagerService) {}

  @Get("test-kafka")
  public get(@Res() res: Response) {
    const result = { name: "bao", age: 29 };

    setTimeout(() => {
      res.status(200).json(result);
    }, 100);
  }

  @Post("test-kafka/save")
  public postSave(@Body() body: any, @Req() req: Request): Observable<any> {
    const rid = (req.headers["x-requestid"] as string) || "12134131";

    const requestToKafka = () => {
      const message = {
        rid,
        eventName: KafkaProducerEventName.TEST_KAFKA,
        data: body,
      };

      this.kafkaProducer.send(topic, message);
    };

    return this.restResponseManager.waitResponse$<any>(rid, requestToKafka).pipe(
      map((data): any => data),
      catchError((e: any) => {
        console.log("Error occurred", e.stack, { error: e.toString() });
        return throwError(e);
      }),
    );
  }
}
