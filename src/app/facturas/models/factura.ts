import { ItemFactura } from './itemFactura';
import { Cliente } from '../../clientes/cliente';

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  items: ItemFactura[] = [];
  cliente: Cliente;
  total: number;
  createAt: string;

  calcularGranTotal(): number {
    return this.items.reduce((total, item) => total + item.calcularImporte(), 0);
  }
}
