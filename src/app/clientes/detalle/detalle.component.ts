import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  imagen: File;
  progreso = 0;

  constructor(private clienteService: ClienteService, private modalService: ModalService) {}

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
}
