import { CafeteriaService } from './../../services/cafeteria.service';
import { ItemVenda } from './../../entity/ItemVenda';
import { CartaoCliente } from './../../entity/CartaoCliente';
import { Produto } from './../../entity/Produto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CadastroProdutoService } from 'src/app/services/cadastro-produto.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from "@angular/router";
import {CartaoClienteService} from "../../services/cartao-cliente.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-cafeteria',
  templateUrl: './cafeteria.component.html',
  styleUrls: ['./cafeteria.component.css']
})
export class CafeteriaComponent implements OnInit {
  setor: string = "CAFETERIA";
  produtos: Produto[] = [];
  cartoes: CartaoCliente[] = [];
  produtoSelecionado: any;
  cartaoSelecionado: any = {};
  quantidade: any = 0;
  rfidSelecionado: boolean = false;

  porta: any;
  reader: any;

  formulario: FormGroup = this.formBuilder.group({});

  // displayedColumns: string[] = ['nome', 'rfid', 'cpf', 'cartao_pago', 'produtos', 'acao'];
  displayedColumns: string[] = ['nome', 'preco_venda', 'qtd', 'acao'];

  dataSource = new MatTableDataSource<ItemVenda>(this.cartaoSelecionado.produtos_cafeteria);
  // dataSource = new MatTableDataSource<CartaoCliente>(this.cartoes);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public cafeteriaService: CafeteriaService,
    public cadastroProdutoService: CadastroProdutoService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private sant: DomSanitizer, private router: Router, private cartaoClienteService: CartaoClienteService ) {
    this.veririficarUsuario('CAFETERIA');
    // this.carregarProduto();
    // this.carregarCartaoCliente();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      rfid: ['', [Validators.required]],
      codigoBarras: ['', [Validators.required]],
      quantidade: [1, [Validators.required]]
    });
  }

  bucarCartaoClientePorRfid() {
    this.cartaoClienteService.buscarCartaoClientePorRfid(this.formulario.get('rfid')?.value).subscribe(
      data => {
        this.cartaoSelecionado = data;
        this.rfidSelecionado = true;
        this.toastr.success('Cartão Cliente encontrado!');
      },
      error => this.toastr.error('Rfid não encontrado!')
    );
  }

  bucarProdutoPorCodigoDeBarras() {
    this.cadastroProdutoService.buscarProdutoPorCodigoDeBarras(this.formulario.get('codigoBarras')?.value).subscribe(
      data => {
        this.produtoSelecionado = data;
        this.addCarrinho(this.produtoSelecionado, this.formulario.get('quantidade')?.value);
        this.toastr.success('Produto adicionado no carrinho!');
      },
      error => this.toastr.error('Produto não encontrado!')
    );
  }


  addCarrinho(produtoSelecionado: any, qtd: number): void {

    let itemVenda: ItemVenda = { produto: produtoSelecionado, quantidade: qtd };

    let atualizacao: boolean = false;

    for (let item of this.cartaoSelecionado.produtos_cafeteria) {
      if (produtoSelecionado.codigo_barras === item.produto.codigo_barras) {
        const index = this.cartaoSelecionado.produtos_cafeteria.indexOf(item);
        this.cartaoSelecionado.produtos_cafeteria[index].quantidade = Number(this.cartaoSelecionado.produtos_cafeteria[index].quantidade);
        qtd = Number(qtd);
        this.cartaoSelecionado.produtos_cafeteria[index].quantidade += qtd;
        atualizacao = true;
      }
    }
    if (!atualizacao) {
      this.cartaoSelecionado.produtos_cafeteria.push(itemVenda);
      this.dataSource.data = this.cartaoSelecionado.produtos_cafeteria;
    }

  }

  removerCarrinho(index: any): void {
    this.cartaoSelecionado.produtos_cafeteria.splice(index, 1);
  }

  addProdutosAoCartao() {

      this.cafeteriaService.addProdutosAoCartaoCliente(this.cartaoSelecionado).subscribe(
        data => {
          this.toastr.success('Produtos adicionados ao cartão!');
        },
        error => this.toastr.error('Não foi possível Adicionar protudos ao Cartão: ' + error.error.ERRORS)
      );


  }

  limparProdutosCartao(cartaoCliente: CartaoCliente) {
    this.cafeteriaService.limparProdutosCartao(cartaoCliente).subscribe(
      data => {
        this.toastr.success('Produtos removidos do Cartão Cliente!');
        this.carregarProduto();
        this.carregarCartaoCliente();
      },
      error => this.toastr.error('Não foi possível Limpar os Produtos do Cartão Cliente: ' + error.error.ERRORS)
    )
  }

  limpar() {
    this.formulario.get('rfid')?.setValue('');
    this.formulario.get('codigoBarras')?.setValue('');
    this.formulario.get('quantidade')?.setValue(1);
    this.rfidSelecionado = false;
  }

  carregarProduto() {
    this.cadastroProdutoService.carregarProdutoPorSetor(this.setor).subscribe((produto: Produto[]) =>
      this.carregarListaProdutos(produto)
    )
  }

  carregarListaProdutos(produtos: Produto[]): void {
    this.produtos = produtos;
  }


  carregarCartaoCliente() {
    this.cafeteriaService.carregarCartaoClientes().subscribe((cartoes: CartaoCliente[]) =>
      this.carregarListaCartaoCliente(cartoes)
    )
  }

  carregarListaCartaoCliente(cartoes: CartaoCliente[]): void {
    this.cartoes = cartoes;
  }


  produtoFunc(produto: Produto[]): Produto[] {
    return produto;
  }

  camposPreenchidos(): boolean {
    return this.cartaoSelecionado && this.produtoSelecionado && this.quantidade > 0;
  }

  clienteSelecionado(): boolean {
    return this.cartaoSelecionado.nome != '';
  }

  carrinhoPreenchido(): boolean {
    return this.cartaoSelecionado.produtos_cafeteria.length > 0;
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

  async readerBalanca(): Promise<any> {

    if (this.produtoSelecionado.fracionado) {
      let navegador: any;

      navegador = window.navigator;

      if (navegador && navegador.serial) {
        this.porta = await navegador.serial.requestPort();
        await this.porta.open({ baudRate: 4800 });

        while (this.porta.readable) {
          this.reader = this.porta.readable.getReader();
          try {
            while (true) {
              const { value, done } = await this.reader.read();
              if (this.produtoSelecionado.fracionado) {
                const { value, done } = await this.reader.read();
                const hex = buf2hex(value)
                const ascii = hex2a(hex)
                this.formatarPeso(ascii)
              } else {
                this.reader.releaseLock();
                this.porta.close();
                return;
              }
            }
          } catch (error) {
          } finally {
            this.reader.releaseLock();
          }
        }
      } else {
        this.toastr.error("Navegador não suporta leitura serial");
      }

      function buf2hex(buffer: any) { // buffer is an ArrayBuffer
        return [...new Uint8Array(buffer)]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('');
      }

      function toHexString(byteArray: any) {// Byte Array -> HEX
        return Array.from(byteArray,
          function (byte: any) {
            return ('0' + (byte & 0XFF).toString(16)).slice(-2);
          }).join()
      }

      function hex2a(hexx: any) { // HEX-> ASCII
        var hex = hexx.toString(); //força conversão
        var str = ''
        for (var i = 0; i < hex.length; i += 2) {
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
      }
    }
  }


  formatarPeso(ascii: any) {

    var valor = Number(ascii);
    if (!valor) {
      valor = Number(ascii.substring(1));
    }
    this.quantidade = valor;
  }
}
