import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { KafkaContext } from "@nestjs/microservices";
import { of, Observable } from "rxjs";
import { switchMap, tap, catchError } from "rxjs/operators";

import { KafkaConsumerMessageGuard } from "./kafka-consumer.guard";

@Injectable()
export class KafkaInterceptor implements NestInterceptor {
  constructor(private guard: KafkaConsumerMessageGuard) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const payload = JSON.parse(Buffer.from(JSON.stringify(context.getArgByIndex<KafkaContext>(1).getMessage())).toString());

    // if (!this.guard.isKafkaConsumerMessage(payload)) {
    //   return of(null);
    // }

    const topic: Readonly<string> = context.getArgByIndex<KafkaContext>(1).getTopic();

    const rid = payload.value.rid;

    console.log(rid, topic, payload.value);

    const before = Date.now();

    return of(null).pipe(
      switchMap(() => next.handle()),
      tap(() => {
        console.log(rid, before, Date.now(), topic, payload.value);
      }),
      catchError((e: any) => {
        console.log(rid, before, Date.now(), topic, payload.value, e);
        return of(null);
      }),
    );
  }
}
