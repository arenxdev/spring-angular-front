import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  imagen: File;
  progreso = 0;

  constructor(
    private clienteService: ClienteService,
    private modalService: ModalService,
    protected authService: AuthService,
    private facturaService: FacturaService
  ) {}

  ngOnInit() {
    // this.activatedRoute.paramMap.subscribe(params => {
    //   const id: number = +params.get('id');
    //   if (id) {
    //     this.clienteService.getCliente(id).subscribe(res => (this.cliente = res.cliente as Cliente));
    //   }
    // });
  }

  seleccionarImagen(event) {
    this.imagen = event.target.files[0];
    this.progreso = 0;
    console.log(this.imagen);
    if (this.imagen.type.indexOf('image') < 0) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El archivo debe ser de tipo imagen'
      });
      this.imagen = null;
    }
  }

  subirImagen() {
    if (!this.imagen) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar una imagen'
      });
    } else {
      this.clienteService
        .uploadImg(this.imagen, this.cliente.id)
        .pipe(
          tap((event: HttpEvent<any>) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progreso = Math.round((event.loaded / event.total) * 100);
            } else if (event.type === HttpEventType.Response) {
              const res: any = event.body;
              this.cliente = res.cliente as Cliente;
              this.modalService.notificarUpload.emit(this.cliente);
              swal.fire('Imagen Cargada', `${res.mensaje} : ${res.cliente.imagen}`, 'success');
            }
          })
          // map(res => {
          //   swal.fire('Imagen CarSgada', `${res.mensaje} : ${res.cliente.imagen}`, 'success');
          //   this.cliente = res.cliente as Cliente;
          // })
        )
        .subscribe();
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.imagen = null;
    this.progreso = 0;
  }

  delete(factura: Factura) {
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
          this.facturaService.delete(factura.id).subscribe(res => {
            this.cliente.facturas = this.cliente.facturas.filter(fac => fac !== factura);
            // swal.fire('Factura Eliminado', `${res.mensaje} : ${cliente.nombre}`, 'success');
            swal.fire('Factura Eliminado', `Factura eliminada: ${factura.id}`, 'success');
          });
        }
      });
  }
}
