import { RfidService } from './../../../services/rfid.service';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {CartaoClienteService} from "../../../services/cartao-cliente.service";
import {CartaoCliente} from "../../../entity/CartaoCliente";
import { Router } from '@angular/router';

@Component({
  selector: 'app-fiscal-saida',
  templateUrl: './fiscal-saida.component.html',
  styleUrls: ['./fiscal-saida.component.css']
})
export class FiscalSaidaComponent implements OnInit {

  formulario: FormGroup = this.formBuilder.group({});
  cartaoCliente: CartaoCliente =  { cartao_pago: false, cpf: '', nome: '', produtos_cafeteria: [], rfid: '' }

  constructor(private router: Router, private formBuilder: FormBuilder, private toastr:ToastrService, private cartaoClienteService: CartaoClienteService,
    public rfidService:RfidService) { }

  ngOnInit(): void {
    this.veririficarUsuario('FISCAL');
    this.formulario = this.formBuilder.group({
      rfid: ['']
    });
  }
  ngAfterViewInit(): void {
    this.focusPrimeiroElementoFormulario();
  }

  verificarCartaoCliente() {
    if(!this.formulario.get('rfid')?.value){
      this.toastr.warning('Preencha o campo corretamente!')
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
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  limpar(): void{
    this.formulario.controls['rfid'].setValue("");
  }

  focusPrimeiroElementoFormulario(): void{
    let blurElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
    blurElement.blur();

    setTimeout(function(){
      let focusElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
      focusElement.focus();
    },0);
  }

  veririficarUsuario(tela: string) {
    if (localStorage.getItem('usuario')) {
      let usuario = JSON.parse(localStorage.getItem('usuario') || '');

      for (let i = 0; i < usuario.telas.length; i++) {
        if (usuario.telas[i].nome === tela) {
          return;
        }
      }
      return this.router.navigate(['/home']);
    }

    return this.router.navigate(['/login']);

  }


}
