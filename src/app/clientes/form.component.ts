import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  cliente: Cliente = new Cliente();
  titulo = 'Crear cliente';
  errores: string[];

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.clienteService.getCliente(id).subscribe(res => (this.cliente = res.cliente));
      }
    });
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      res => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo Cliente', `${res.mensaje} : ${res.cliente.nombre}`, 'success');
      },
      err => {
        this.errores = err.error.errores as string[];
        console.error(`Código de error desde el backend: `);
        console.error(this.errores);
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      res => {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente Actualizado', `${res.mensaje} : ${res.cliente.nombre}`, 'success');
      },
      err => {
        this.errores = err.error.errores as string[];
        console.error(`Código de error desde el backend: `);
        console.error(this.errores);
      }
    );
  }
}
