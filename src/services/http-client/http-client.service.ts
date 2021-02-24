import { Injectable, HttpService } from "@nestjs/common";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";

import { getSid as _getSid } from "../utils";

export const external = {
  getSid: _getSid,
};

/**
 * This service wraps HttpModule of Nestjs to request by using the HTTP protocol.
 */
@Injectable()
export class HttpClientService {
  public constructor(private readonly http: HttpService) {}

  public get$<T>(reqParams: any, path: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    const sid = external.getSid();
    const startTime = Date.now();
    console.log(reqParams, sid, "GET", path, config);

    return this.http.get<T>(path, config).pipe(
      tap((response) => console.log(reqParams, sid, startTime, Date.now(), "GET", path, response)),
      catchError((e) => {
        console.log(reqParams, sid, startTime, Date.now(), "GET", path, e);
        return throwError(e);
      }),
    );
  }

  public post$<T>(reqParams: any, path: string, data?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    const sid = external.getSid();
    const startTime = Date.now();
    console.log(reqParams, sid, "POST", path, data, config);

    return this.http.post<T>(path, data, config).pipe(
      tap((response) => console.log(reqParams, sid, startTime, Date.now(), "POST", path, response)),
      catchError((e) => {
        console.log(reqParams, sid, startTime, Date.now(), "POST", path, e, data);
        return throwError(e);
      }),
    );
  }

  public delete$<T>(reqParams: any, path: string, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    const sid = external.getSid();
    const startTime = Date.now();
    console.log(reqParams, sid, "DELETE", path, config);

    return this.http.delete<T>(path, config).pipe(
      tap((response) => console.log(reqParams, sid, startTime, Date.now(), "DELETE", path, response)),
      catchError((e) => {
        console.log(reqParams, sid, startTime, Date.now(), "DELETE", path, e);
        return throwError(e);
      }),
    );
  }
}
