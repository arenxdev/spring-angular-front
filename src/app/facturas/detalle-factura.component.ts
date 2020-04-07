import { Component, OnInit } from '@angular/core';
import { FacturaService } from './services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { Factura } from './models/factura';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {
  titulo = 'Detalle Factura';
  factura: Factura;

  constructor(private facturaService: FacturaService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.facturaService
        .getFactura(id)
        .pipe(tap(factura => (this.factura = factura)))
        .subscribe();
    });
  }
}
