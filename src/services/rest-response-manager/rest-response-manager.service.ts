import { Injectable } from "@nestjs/common";

import { Subject, Observable, of, combineLatest } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class RestResponseManagerService {
  private readonly restResponseStock: { [key: string]: Subject<any> } = {};

  constructor() {}

  public checkAddressedToYou(rid: string): boolean {
    return rid in this.restResponseStock;
  }

  public waitResponse$<T>(rid: string, request: () => void): Observable<T> {
    const response$ = new Subject<T>();
    this.stockRestResponse(rid, response$);

    return combineLatest(of(request()), response$).pipe(map(([, response]) => response));
  }

  public notifyResponse<T>(rid: string, message: T) {
    const res$ = this.retrieveRestResponse(rid);
    res$.next(message);
    res$.complete();
  }

  public notifyInvalidResponse(rid: string, error: any) {
    const res$ = this.retrieveRestResponse(rid);
    res$.error(error);
    res$.complete();
  }

  private stockRestResponse(key: string, subject: Subject<any>) {
    console.log(`stock waiting for response of key:${key}`);
    this.restResponseStock[key] = subject;
  }

  private retrieveRestResponse(key: string): Subject<any> | undefined {
    console.log(`retrieve waiting for response of key:${key}`);
    const subject = this.restResponseStock[key];
    delete this.restResponseStock[key];
    return subject;
  }
}
