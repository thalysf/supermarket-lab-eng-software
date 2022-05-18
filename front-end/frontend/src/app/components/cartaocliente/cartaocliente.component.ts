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

  constructor(public dialog: MatDialog, public cartaoClienteService: CartaoClienteService, private toastr: ToastrService, private router: Router) {
    this.veririficarUsuario('CARTAOCLIENTE');
    this.carregarCartoesClientes();
    this.carregarcartoes();
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  inserir() {
    if (this.cartaoValido(this.cartaoCliente)) {
      this.cartaoCliente.cartao_pago = false;
      this.cartaoCliente.produtos_cafeteria = [];
      console.log(this.cartaoCliente);
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
  }


  editar() {
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
  }

  excluir(cartao: CartaoCliente) {
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
    this.cartaoCliente = { cartao_pago: cartao.cartao_pago, cpf: cartao.cpf, nome: cartao.nome, produtos_cafeteria: cartao.produtos_cafeteria, rfid: cartao.rfid };
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

  async readerRfid(): Promise<any> {
    let navegador: any;

      navegador = window.navigator;

      if (navegador && navegador.serial) {
        const porta = await navegador.serial.requestPort();
        await porta.open({ baudRate: 115200 });

        while (porta.readable) {
          const reader = porta.readable.getReader();
          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                break;
              }
              const hex   = this.buf2hex(value)
              const ascii = this.hex2a(hex)
              this.cartaoCliente.rfid = hex.slice(-10,-4);
            }
          } catch (error) {
          } finally {
            reader.releaseLock();
          }
        }
        }
      }

      buf2hex(buffer: any) { // buffer is an ArrayBuffer
        return [...new Uint8Array(buffer)]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('');
      }
    
      toHexString(byteArray: any) {// Byte Array -> HEX
        return Array.from(byteArray,
          function (byte: any) {
            return ('0' + (byte & 0XFF).toString(16)).slice(-2);
          }).join()
      }
    
      hex2a(hexx: any) { // HEX-> ASCII
        var hex = hexx.toString(); //força conversão
        var str = ''
        for (var i = 0; i < hex.length; i += 2) {
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
      }

}
