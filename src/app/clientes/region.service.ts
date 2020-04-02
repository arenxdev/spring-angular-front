import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Region } from './region';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';

@Injectable()
export class RegionService {
  private urlEndPoint = 'http://localhost:8080/api/region';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  getRegiones(): Observable<Region[]> {
    return this.http.get(this.urlEndPoint).pipe(map((res: any) => res.regiones as Region[]));
  }
}
