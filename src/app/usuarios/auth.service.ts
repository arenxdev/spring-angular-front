import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _usuario: Usuario;
  private _token: string;
  private _httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  login(usuario: Usuario): Observable<any> {
    const urlEndPoint = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularapp:12345');
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credenciales}`
    });
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(accessToken: string): void {
    const payload = this.obtenerPayload(accessToken);
    this._usuario = new Usuario();
    if (payload) {
      this._usuario.nombre = payload.nombre;
      this._usuario.apellido = payload.apellido;
      this._usuario.email = payload.email;
      this._usuario.username = payload.user_name;
      this._usuario.roles = payload.authorities;
      sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    }
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  obtenerPayload(accessToken: string): any {
    if (accessToken !== null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    const payload = this.obtenerPayload(this.token);
    return payload && payload.user_name && payload.user_name.length > 0;
  }

  logOut(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
  }

  hasRole(rol: string) {
    return this.usuario.roles.includes(rol);
  }

  public get usuario(): Usuario {
    if (this._usuario) {
      return this._usuario;
    } else if (sessionStorage.getItem('usuario') !== null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this.usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token) {
      return this._token;
    } else if (sessionStorage.getItem('token') !== null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  public get httpHeaders(): HttpHeaders {
    const token = this.token;
    if (token) {
      return this._httpHeaders.append('Authorization', `Bearer ${token}`);
    }
    return this._httpHeaders;
  }
}
