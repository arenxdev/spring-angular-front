import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Region } from './region';

@Injectable()
export class RegionService {
  private urlEndPoint = 'http://localhost:8080/api/region';

  constructor(private http: HttpClient) {}

  getRegiones(): Observable<Region[]> {
    return this.http.get(this.urlEndPoint).pipe(map((res: any) => res.regiones as Region[]));
  }
}
