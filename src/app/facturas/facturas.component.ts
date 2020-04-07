import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../clientes/cliente';
import { FormControl } from '@angular/forms';
import { startWith, map, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Producto } from './models/producto';
import { FacturaService } from './services/factura.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ItemFactura } from './models/itemFactura';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
})
export class FacturasComponent implements OnInit {
  titulo = 'Nueva factura';
  factura: Factura = new Factura();
  autocompleteControl = new FormControl();
  productos: Producto[];
  productosFiltrados: Observable<Producto[]>;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const idCliente = +params.get('idCliente');
      this.clienteService.getCliente(idCliente).subscribe((res) => (this.factura.cliente = res.cliente as Cliente));
    });
    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map((value) => (typeof value === 'string' ? value : value.nombre)),
      flatMap((value) => (value ? this._filter(value) : []))
    );
  }

  mostrarNombre(producto?) {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;
    console.log(producto);
    if (this.existeItem(producto.id)) {
      this.incrementarCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(idProducto: number, event: any): void {
    const cantidad = +event.target.value;
    if (cantidad <= 0) {
      this.eliminarItemFactura(idProducto);
    } else {
      this.factura.items = this.factura.items.map((item: ItemFactura) => {
        if (item.producto.id === idProducto) {
          item.cantidad = cantidad;
        }
        return item;
      });
    }
  }

  existeItem(idProducto: number): boolean {
    return this.factura.items.map((item: ItemFactura) => item.producto.id).includes(idProducto);
  }

  incrementarCantidad(idProducto: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (item.producto.id === idProducto) {
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(idProducto: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => item.producto.id !== idProducto);
  }

  crearFactura() {
    console.log(this.factura);
    this.facturaService.crear(this.factura).subscribe((factura) => {
      swal.fire({
        icon: 'success',
        title: 'Factura Creada',
        text: `Factura ${factura.descripcion} creada exitosamente para el cliente ${factura.cliente.nombre}`,
      });
      this.router.navigate(['/clientes']);
    });
  }

  private _filter(nombreProducto: string): Observable<Producto[]> {
    return this.facturaService.filtrarProductos(nombreProducto);
  }
}
