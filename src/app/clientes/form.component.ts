import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { RegionService } from './region.service';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  cliente: Cliente = new Cliente();
  regiones: any;
  titulo = 'Crear cliente';
  errores: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private regionService: RegionService
  ) {}

  ngOnInit() {
    this.cargarCliente();
    this.regionService.getRegiones().subscribe((regiones) => (this.regiones = regiones));
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      if (id) {
        this.clienteService.getCliente(id).subscribe((res) => (this.cliente = res.cliente));
      }
    });
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      (res) => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo Cliente', `${res.mensaje} : ${res.cliente.nombre}`, 'success');
      },
      (err) => {
        this.errores = err.error.errores as string[];
        console.error(`Código de error desde el backend: `);
        console.error(this.errores);
      }
    );
  }

  update(): void {
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(
      (res) => {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente Actualizado', `${res.mensaje} : ${res.cliente.nombre}`, 'success');
      },
      (err) => {
        this.errores = err.error.errores as string[];
        console.error(`Código de error desde el backend: `);
        console.error(this.errores);
      }
    );
  }

  comparar(o1: any, o2: any): boolean {
    return (o1 === undefined && o2 === undefined) || (o1 && o2 && o1.id === o2.id);
  }
}
