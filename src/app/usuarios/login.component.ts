import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  title = 'Por favor Sing In!';

  usuario: Usuario;

  constructor(private router: Router, private authService: AuthService) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/clientes']);
      swal.fire({
        icon: 'success',
        title: 'Login',
        text: `Hola ${this.authService.usuario.username}, ya estás autenticado`
      });
    }
  }

  login(): void {
    if (!this.usuario.username || !this.usuario.password) {
      swal.fire({
        icon: 'error',
        title: 'Error login',
        text: 'Usuario o contraseña vacío'
      });
      return;
    }

    this.authService.login(this.usuario).subscribe(
      res => {
        this.authService.guardarUsuario(res.access_token);
        this.authService.guardarToken(res.access_token);
        this.router.navigate(['/clientes']);
        this.usuario = this.authService.usuario;
        swal.fire({
          icon: 'success',
          title: 'Login',
          text: `Hola ${this.usuario.username}`
        });
      },
      err => {
        if (err.status === 400) {
          swal.fire({
            icon: 'error',
            title: 'Error login',
            text: 'Usuario o contraseña incorrecta'
          });
        }
      }
    );
  }
}
