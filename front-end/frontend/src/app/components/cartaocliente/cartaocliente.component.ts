import { RfidService } from './../../services/rfid.service';
import { CartaoCliente } from 'src/app/entity/CartaoCliente';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { CartaoClienteService } from 'src/app/services/cartao-cliente.service';

@Component({
  selector: 'app-cartaocliente',
  templateUrl: './cartaocliente.component.html',
  styleUrls: ['./cartaocliente.component.css']
})
export class CartaoclienteComponent implements OnInit {

  cartaoCliente: CartaoCliente = { cartao_pago: false, cpf: '', nome: '', produtos_cafeteria: [], rfid: '' }
  displayedColumns: string[] = ['rfid', 'nome', 'cpf', 'acao'];

  cartoes: CartaoCliente[] = [];

  dataSource = new MatTableDataSource<CartaoCliente>(this.cartoes);

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public cartaoClienteService: CartaoClienteService, private toastr: ToastrService, private router: Router,
    public rfidService:RfidService) {
    this.veririficarUsuario('CARTAOCLIENTE');
    this.carregarCartoesClientes();
    this.carregarcartoes();
  }
  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.focusPrimeiroElementoFormulario();
  }

  inserir() {
    this.cartaoCliente.rfid = this.rfidService.rfid;
    if (this.cartaoValido(this.cartaoCliente)) {
      this.cartaoCliente.cartao_pago = false;
      this.cartaoCliente.produtos_cafeteria = [];
      this.cartaoClienteService.criarCartaoCliente(this.cartaoCliente).subscribe(
        data => {
          this.carregarcartoes();
          this.toastr.success("Cartão Cliente cadastrado com sucesso!");
        },
        error => this.toastr.error('Não foi possível Inserir o Cartão Cliente: ' + error.error.ERRORS)
      );

      this.carregarcartoes();
    }
    else {
      this.toastr.warning('Preencha os campos corretamente!');
    }
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }


  editar() {
    this.cartaoCliente.rfid = this.rfidService.rfid;
    if (this.cartaoValido(this.cartaoCliente)) {
    this.cartaoClienteService.atualizarCartaoCliente(this.cartaoCliente).subscribe(
      data => {
        this.carregarcartoes();
        this.toastr.success("Cartão Cliente atualizado com sucesso!");
      },
      error => this.toastr.error('Não foi possível Atualizar o Cartão Cliente: ' + error.error.ERRORS)
    );
    }
    else{
      this.toastr.warning('Preencha os campos corretamente!');
    }
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  excluir(cartao: CartaoCliente) {
    this.cartaoCliente.rfid = this.rfidService.rfid;
    this.cartaoClienteService.excluirCartaoCliente(cartao).subscribe(
      data => {
        this.carregarcartoes();
        this.toastr.success("Cartão Cliente deletado com sucesso!");
      },
      error => this.toastr.error('Não foi possível Excluir o Cartão Cliente: ' + error.error.ERRORS)
    );
  }

  limpar() {
    this.cartaoCliente = { cartao_pago: false, cpf: '', nome: '', produtos_cafeteria: [], rfid: '' };
  }

  focusPrimeiroElementoFormulario(): void{
    let blurElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
    blurElement.blur();

    setTimeout(function(){
      let focusElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
      focusElement.focus();
    },0);
  }

  carregarCartoesClientes() {
    this.cartaoClienteService.carregarCartoesClientes().subscribe(
      data => this.cartoes = data,
      error => this.toastr.error('Não foi possível Carregas os Cartões Cliente: ' + error.error.ERRORS)
    );
  }

  carregarcartoes() {
    this.cartaoClienteService.carregarCartoesClientes().subscribe((cartoes: CartaoCliente[]) =>
      this.dataSource.data = this.cartoesFunc(cartoes)
    )
  }

  cartoesFunc(cartoes: CartaoCliente[]): CartaoCliente[] {
    return cartoes
  }

  carregar(cartao: CartaoCliente) {
    this.cartaoCliente = { cartao_pago: cartao.cartao_pago, cpf: cartao.cpf, nome: cartao.nome, produtos_cafeteria: cartao.produtos_cafeteria, rfid: this.rfidService.rfid };
  }

  cartaoValido(cartao: CartaoCliente): boolean {
    return this.cartaoCliente.rfid != '' && this.cartaoCliente.cpf != '' && this.cartaoCliente.nome != '';
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
