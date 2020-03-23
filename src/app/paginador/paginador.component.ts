import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html'
})
export class PaginadorComponent implements OnInit, OnChanges {
  @Input() paginador: any;
  paginas: number[];
  desde: number;
  hasta: number;
  rango: number;

  constructor() {}

  ngOnInit() {
    this.initPagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const paginadorActualizado = changes.paginador;
    if (paginadorActualizado.previousValue) {
      this.initPagination();
    }
  }

  initPagination(): void {
    if (!this.rango) {
      this.rango = 5;
    }
    if (this.paginador.totalPages > this.rango) {
      console.log(`RANGO: ${this.rango}`);
      this.desde = Math.min(
        Math.max(1, this.paginador.number - (this.rango - 1)),
        this.paginador.totalPages - this.rango * 2
      );
      this.hasta = Math.max(
        Math.min(this.paginador.totalPages, this.paginador.number + this.rango + 1),
        this.rango * 2 + 1
      );
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((valor, indice) => indice + this.desde);
    } else {
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice + 1);
    }
  }
}
