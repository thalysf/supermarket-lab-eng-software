import { CafeteriaService } from './../../services/cafeteria.service';
import { ItemVenda } from './../../entity/ItemVenda';
import { CartaoCliente } from './../../entity/CartaoCliente';
import { Produto } from './../../entity/Produto';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CadastroProdutoService } from 'src/app/services/cadastro-produto.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from "@angular/router";

@Component({
  selector: 'app-cafeteria',
  templateUrl: './cafeteria.component.html',
  styleUrls: ['./cafeteria.component.css']
})
export class CafeteriaComponent implements OnInit {
  setor: string = "CAFETERIA";
  produtos: Produto[] = [];
  cartoes: CartaoCliente[] = [];
  produtoSelecionado: Produto = {codigo_barras: '', nome: '', qtd_estoque: 0};
  cartaoSelecionado: CartaoCliente = {rfid: '', cpf: '', nome: '', produtos_cafeteria: [], cartao_pago: false};
  quantidade: any= 0;

  porta:any;
  reader:any;

  displayedColumns: string[] = ['nome', 'rfid', 'cpf', 'cartao_pago', 'produtos', 'acao'];

  dataSource = new MatTableDataSource<CartaoCliente>(this.cartoes);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public cafeteriaService: CafeteriaService, 
    public cadastroProdutoService: CadastroProdutoService,
    private toastr: ToastrService, private sant: DomSanitizer, private router: Router) {
    this.veririficarUsuario('CAFETERIA');
    this.carregarProduto();
    this.carregarCartaoCliente();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    
  }

  addCarrinho(produtoSelecionado: Produto, qtd: number): void {
    if(!this.camposPreenchidos()){
      this.toastr.error("Preencha os campos antes de incluir um produto no carrinho!");
    }
    else{
      let itemVenda: ItemVenda = {produto: produtoSelecionado, quantidade: qtd}

      let atualizacao: boolean = false;
  
      for(let item of this.cartaoSelecionado.produtos_cafeteria){
        if(produtoSelecionado.codigo_barras === item.produto.codigo_barras){
            const index = this.cartaoSelecionado.produtos_cafeteria.indexOf(item)
            this.cartaoSelecionado.produtos_cafeteria[index].quantidade = qtd
  
            atualizacao = true;
        }
      }
      if(!atualizacao){
        this.cartaoSelecionado.produtos_cafeteria.push(itemVenda);
      } 
    }
  }

  removerCarrinho(index: any): void{
    this.cartaoSelecionado.produtos_cafeteria.splice(index, 1);
  }

  async addProdutosAoCartao() {
    if(!this.carrinhoPreenchido()){
      this.toastr.error("Para finalizar uma compra na Cafeteria deve haver ao menos um produto!");
    }
    else if(!this.clienteSelecionado())
    {
      this.toastr.error("Selecione o Cliente!");
    }
  else {
      this.cafeteriaService.addProdutosAoCartaoCliente(this.cartaoSelecionado).subscribe(
        data => {
          this.toastr.success('Produtos adicionados ao cartão!');
          this.carregarProduto();
          this.carregarCartaoCliente();
        },
        error => this.toastr.error('Não foi possível Adicionar protudos ao Cartão: ' + error.error.ERRORS)
      );
    }
  }

  limparProdutosCartao(cartaoCliente: CartaoCliente) {
    this.cafeteriaService.limparProdutosCartao(this.cartaoSelecionado).subscribe(
      data => {
        this.toastr.success('Produtos removidos do Cartão Cliente!');
        this.carregarProduto();
        this.carregarCartaoCliente();
      },
      error => this.toastr.error('Não foi possível Excluir o Cartão Cliente: ' + error.error.ERRORS)
    )
  }

  limpar() {
    this.cartaoSelecionado = {rfid: '', cpf: '', nome: '', produtos_cafeteria: [], cartao_pago: false};
    this.produtoSelecionado = {codigo_barras: '', nome: '', qtd_estoque: 0};
    this.quantidade = 0;
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
    this.dataSource.data = this.cartoes
    console.log(cartoes)
  }
  

  produtoFunc(produto: Produto[]): Produto[] {
    return produto
  }

  camposPreenchidos(): boolean
  {
    return this.cartaoSelecionado.nome != '' && this.produtoSelecionado.nome != '' && this.quantidade > 0;
  }
  
  clienteSelecionado(): boolean
  {
    return this.cartaoSelecionado.nome != '';
  }

  carrinhoPreenchido(): boolean
  {
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

    if(this.produtoSelecionado.fracionado){
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
            if(this.produtoSelecionado.fracionado){
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
      console.log("Navegador não suporta leitura serial")
    }

    function buf2hex(buffer: any) { // buffer is an ArrayBuffer
      return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
    }

    function toHexString(byteArray: any) {// Byte Array -> HEX 
      return Array.from(byteArray, 
        function(byte: any) { 
          return ('0' + (byte & 0XFF).toString(16)).slice(-2); }).join() 
    } 

    function hex2a(hexx: any) { // HEX-> ASCII 
        var hex = hexx.toString(); //força conversão 
        var str = ''
        for (var i = 0; i < hex.length; i +=  2) 
          {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); 
          }
        return str;
    }
  }
}


  formatarPeso(ascii:any){
  
    var valor = Number(ascii);
    if(!valor){
      valor = Number(ascii.substring(1));
    }
    this.quantidade = valor;
  }
}
