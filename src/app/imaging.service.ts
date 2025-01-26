import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cluster } from './cluster';

@Injectable({
  providedIn: 'root'
})
export class ImagingService {

  _url = 'http://localhost:8009';
  public data: any
  constructor(private _http: HttpClient) { }

  startImaging(cluster: Cluster) {
    return this._http.post<any>(this._url, cluster);
  }
}
