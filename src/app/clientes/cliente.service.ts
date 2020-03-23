import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Injectable, Pipe } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import swal from 'sweetalert2';

import { Cliente } from './cliente';

@Injectable()
export class ClienteService {
  private urlEndPoint = 'http://localhost:8080/api/cliente';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  getClientes(page: number): Observable<any> {
    // return this.http.get(this.urlEndPoint).pipe(map(ResponseOne => ResponseOne as Cliente[]));
    return this.http.get(`${this.urlEndPoint}/page/${page}`).pipe(
      catchError(err => {
        swal.fire({
          icon: 'error',
          title: err.error.mensaje,
          text: err.error.error
        });
        return throwError(err);
      }),
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
    return this.http.get(`${this.urlEndPoint}/${id}`).pipe(
      catchError(err => {
        this.router.navigate(['/clientes']);
        console.error(err);
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.mensaje
        });
        return throwError(err);
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      catchError(err => {
        if (err.status !== 400) {
          swal.fire({
            icon: 'error',
            title: err.error.mensaje,
            text: err.error.error
          });
        }
        return throwError(err);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(err => {
        if (err.status !== 400) {
          swal.fire({
            icon: 'error',
            title: err.error.mensaje,
            text: err.error.error
          });
        }
        return throwError(err);
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders });
  }
}
