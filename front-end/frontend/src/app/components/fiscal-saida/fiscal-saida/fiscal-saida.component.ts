import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {CartaoClienteService} from "../../../services/cartao-cliente.service";
import {CartaoCliente} from "../../../entity/CartaoCliente";

@Component({
  selector: 'app-fiscal-saida',
  templateUrl: './fiscal-saida.component.html',
  styleUrls: ['./fiscal-saida.component.css']
})
export class FiscalSaidaComponent implements OnInit {

  formulario: FormGroup = this.formBuilder.group({});
  cartaoCliente: CartaoCliente =  { cartao_pago: false, cpf: '', nome: '', produtos_cafeteria: [], rfid: '' }

  constructor( private formBuilder: FormBuilder, private toastr:ToastrService, private cartaoClienteService: CartaoClienteService) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      rfid: ['', [Validators.required]]
    });
  }

  verificarCartaoCliente() {
    if(!this.formulario.get('rfid')?.value){
      this.toastr.error('Preencha o CPF!')
    } else {
      this.cartaoClienteService.buscarCartaoClientePorRfid(this.formulario.get('rfid')?.value).subscribe(
        data => {
          this.cartaoCliente = data;
          if(this.cartaoCliente.cartao_pago === false && this.cartaoCliente.produtos_cafeteria.length > 0) {
            this.toastr.error('Cartão ainda não foi pago!')
          }
          else if(this.cartaoCliente.produtos_cafeteria.length === 0){
            this.toastr.warning('Cartão vazio!')
          } 
          else {
            this.toastr.success('Cartão pago com sucesso!')
          }
        },
        error => this.toastr.error('Rfid não encontrado!')
      );
    }
  }



}
