import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../components/clientes/cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable()
export class ClienteService {
  private urlEndPoint = 'http://localhost:8000/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': "application/json" });

  constructor(private http: HttpClient, private router: Router) {}

  getClientes(): Observable<Cliente[]> {
    // return of(CLIENTES);
    return this.http.get<Cliente[]>(this.urlEndPoint).pipe(
      catchError(e => {
        this.showError(e);
        return throwError(e);
      })
    );
    // return this.http.get(this.urlEndPoint).pipe(
    //   map( response => response as Cliente[])
    // );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEndPoint, cliente, {
        headers: this.httpHeaders
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          this.showError(e);
          return throwError(e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        this.showError(e);
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(
      `${this.urlEndPoint}/${cliente.id}`,
      cliente,
      { headers: this.httpHeaders }
    ).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        this.showError(e);
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {
      headers: this.httpHeaders
    }).pipe(
      catchError(e => {
        this.showError(e);
        return throwError(e);
      })
    );
  }

  showError(e: any) {
    console.error(e);
    swal.fire({
      icon: 'error',
      title: `Oops... ${e.error.message}`,
      text: e.error.error
    });
    return throwError(e);
  }
}
