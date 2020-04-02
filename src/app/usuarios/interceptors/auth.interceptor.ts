import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';

import swal from 'sweetalert2';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logOut();
          }
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.router.navigate(['/clientes']);
          swal.fire({
            icon: 'warning',
            title: 'Acceso denegado',
            text: `Hola ${this.authService.usuario.username}, no tienes acceso a este recuerso`
          });
        }
        return throwError(err);
      })
    );
  }
}
