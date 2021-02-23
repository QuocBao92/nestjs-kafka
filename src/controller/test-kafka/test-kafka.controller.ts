import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { KafkaProducerEventName, KafkaProducerService, topic } from "../../services/kafka-producer";

@Controller("test-kafka")
export class TestKafkaController {
  constructor(private kafkaProducer: KafkaProducerService) {}

  @Post("/save")
  public save(@Body() body: any, @Req() req: Request): Observable<any> {
    const rid = req.headers["x-requestid"] as string;
    const message = {
      rid,
      eventName: KafkaProducerEventName.TEST_KAFKA,
      data: body,
    };

    return this.kafkaProducer.send(topic, message).pipe(
      map(() => {
        true;
      }),
      catchError((e: any) => {
        console.log(e);
        return throwError(e);
      }),
    );
  }
}
