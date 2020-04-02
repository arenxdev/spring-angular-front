import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;
  clienteSelecionado: Cliente;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    protected authService: AuthService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const page: number = +params.page || 0;
      this.clienteService
        .getClientes(page)
        .pipe(
          tap(res => {
            console.log('ClientesComponent: TAB3');
            console.log(res.page.content);
          })
        )
        .subscribe(res => {
          this.clientes = res.page.content;
          this.paginador = res.page;
        });
    });

    this.modalService.notificarUpload
      .pipe(
        tap(
          clienteImg =>
            (this.clientes = this.clientes.map(cliente => (cliente.id === clienteImg.id ? clienteImg : cliente)))
        )
      )
      .subscribe();
    // this.activatedRoute.params.subscribe(params => console.log(`params: ${JSON.stringify(params)}`));
    // this.activatedRoute.paramMap.subscribe(params => console.log(`paramMap: ${JSON.stringify(params)}`));
  }

  delete(cliente: Cliente): void {
    swal
      .fire({
        title: '¿Estás seguro?',
        text: 'Este proceso no podrá ser revertido',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'No'
      })
      .then(result => {
        if (result.value) {
          this.clienteService.delete(cliente.id).subscribe(res => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swal.fire('Cliente Eliminado', `${res.mensaje} : ${cliente.nombre}`, 'success');
          });
        }
      });
  }

  abrirModal(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.modalService.abrirModal();
  }
}
