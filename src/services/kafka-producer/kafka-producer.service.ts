import { Injectable, OnModuleDestroy, OnModuleInit, Inject } from "@nestjs/common";

import { ClientKafka } from "@nestjs/microservices";
import { tap, catchError } from "rxjs/operators";
import { of, Observable } from "rxjs";

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject("KAFKA_PRODUCER") public client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
  }

  onModuleDestroy() {
    this.client.close();
  }

  send(topic: string, data: any): Observable<any> {
    const reqParams = {
      rid: data.rid,
    };
    console.log(reqParams, topic, data, "");
    const before = Date.now();

    return this.client.emit(topic, data).pipe(
      tap((response) => {
        console.log(reqParams, before, Date.now(), topic, data, response);
      }),
      catchError((e) => {
        console.log(reqParams, before, Date.now(), topic, data, e);
        return of(null);
      }),
    );
  }
}
