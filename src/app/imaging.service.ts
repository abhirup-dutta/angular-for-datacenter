import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Cluster } from './cluster';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagingService {

  _url = 'http://localhost:8009';
  public data: any
  constructor(private _http: HttpClient) { }

  startImaging(cluster: Cluster) {
    return this._http.post<any>(this._url, cluster)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
