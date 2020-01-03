import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../../services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.loadCustomer();
  }
  
    private loadCustomer(): void {
      this.activatedRoute.params.subscribe((params) => {
        const id = params.id;
        if (id) {
          this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
        }
      });
    }

  public submit() {
    if (this.cliente.id) {
      this.update();
    } else {
      this.create();
    }
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(({ nombre }) => {
      this.router.navigate(['/clientes']);
      swal.fire('Customer saved', `Customer ${nombre} created successfully`, 'success');
    });
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe(({ nombre }) => {
      this.router.navigate(['/clientes']);
      swal.fire('Customer updated', `Customer ${nombre} updated successfully`, 'success');
    });
  }

}
