import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable, Pipe } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';

import { Cliente } from './cliente';
import { AuthService } from '../usuarios/auth.service';

@Injectable()
export class ClienteService {
  private urlEndPoint = 'http://localhost:8080/api/cliente';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  getClientes(page: number): Observable<any> {
    // return this.http.get(this.urlEndPoint).pipe(map(ResponseOne => ResponseOne as Cliente[]));
    return this.http.get(`${this.urlEndPoint}/page/${page}`).pipe(
      tap((res: any) => {
        const clientes = res.page.content as Cliente[];
        console.log('ClienteService: TAB 1');
        console.log(clientes);
      }),
      map((res: any) => {
        const datePipe = new DatePipe('es');
        const clientes = (res.page.content as Cliente[]).map(cliente => ({
          ...cliente,
          nombre: cliente.nombre.toUpperCase()
          // createAt: formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US')
          // createAt: datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy')
        }));
        res.page.content = clientes;
        return res;
      }),
      tap(clientes => {
        console.log('ClienteService: TAB 2');
        console.log(clientes);
      })
    );
    // return of(CLIENTES);
  }

  getCliente(id): Observable<any> {
    // return this.http.get(`${this.urlEndPoint}/${id}`, { headers: this.authService.httpHeaders }).pipe(
    return this.http.get(`${this.urlEndPoint}/${id}`).pipe(
      catchError(err => {
        if (err.status !== 401) {
          this.router.navigate(['/clientes']);
        }
        console.error(err);
        return throwError(err);
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.http.post(this.urlEndPoint, cliente);
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/${id}`);
  }

  uploadImg(archivo: File, id: number): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id.toString());
    // let httpHeaders = new HttpHeaders();
    // const token = this.authService.token;
    // if (token) {
    //   httpHeaders = httpHeaders.append('Authorization', `Bearer ${token}`);
    // }
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
      // headers: httpHeaders
    });
    return this.http.request(req);
  }
}
