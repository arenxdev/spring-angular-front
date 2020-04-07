import { Region } from './region';
import { Factura } from '../facturas/models/factura';
export class Cliente {
  id: number;
  nombre: string;
  apellido: string;
  createAt: string;
  email: string;
  imagen: string;
  region: Region;
  facturas: Factura[] = [];
}
