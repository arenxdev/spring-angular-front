import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Usuario } from '../usuarios/usuario';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  title = 'App Angular';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logOut(): void {
    swal.fire({
      icon: 'success',
      title: 'Logout',
      text: `Hola ${this.authService.usuario.username}, has cerrado sesión con éxito`
    });
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  traerUsuario(): Usuario {
    return this.authService.usuario;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
