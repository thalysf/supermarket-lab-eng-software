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
  cartaoCliente: CartaoCliente = {rfid: '', produtos_cafeteria: [], cartao_pago: false};
  produtoSelecionado: Produto = {codigo_barras: '', nome: '', qtd_estoque: 0};
  quantidade: number= 0;

  displayedColumns: string[] = ['rfid', 'produtos', 'acao'];

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
  
      for(let item of this.cartaoCliente.produtos_cafeteria){
        if(produtoSelecionado.codigo_barras === item.produto.codigo_barras){
            const index = this.cartaoCliente.produtos_cafeteria.indexOf(item)
            this.cartaoCliente.produtos_cafeteria[index].quantidade = qtd
  
            atualizacao = true;
        }
      }
      if(!atualizacao){
        this.cartaoCliente.produtos_cafeteria.push(itemVenda);
      } 
    }
  }

  removerCarrinho(index: any): void{
    this.cartaoCliente.produtos_cafeteria.splice(index, 1);
  }

  async cadastrar() {
    if(!this.carrinhoPreenchido()){
      this.toastr.error("Para cadastrar uma compra na Cafeteria deve haver ao menos um produto!");
    }
    else if(!this.rfidClientePreenchido())
    {
      this.toastr.error("Preencha o RFID do Cliente!");
    }
  else {
      this.cafeteriaService.criarCartaoCliente(this.cartaoCliente).subscribe(
        data => {
          this.toastr.success('Cartão Cliente Cadastrado!');
          this.carregarProduto();
          this.carregarCartaoCliente();
        },
        error => this.toastr.error('Não foi possível Cadastrar o Cartão: ' + error.error.ERRORS)
      );
    }
  }



  atualizar() {
    if(!this.carrinhoPreenchido()){
      this.toastr.error("Para atualizar uma compra na Cafeteria deve haver ao menos um produto!");
    }
    else if(!this.rfidClientePreenchido())
    {
      this.toastr.error("Preencha o RFID do Cliente!");
    }
    else{
      this.cafeteriaService.atualizarCartaoCliente(this.cartaoCliente).subscribe(
        data => {
          this.toastr.success('Cartão Cliente Atualizado!');
          this.carregarProduto();
          this.carregarCartaoCliente();
        },
        error => this.toastr.error('Não foi possível Atualizar o Produto: ' + error.error.ERRORS)
      );
    }
  }

  deletar(cartaoCliente: CartaoCliente) {
    this.cafeteriaService.excluirCartaoCliente(cartaoCliente).subscribe(
      data => {
        this.toastr.success('Cartão Cliente Deletado!');
        this.carregarProduto();
        this.carregarCartaoCliente();
      },
      error => this.toastr.error('Não foi possível Excluir o Cartão Cliente: ' + error.error.ERRORS)
    )
  }

  limpar() {
    this.cartaoCliente = {rfid: '', produtos_cafeteria: [], cartao_pago: false};
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
  }
  

  produtoFunc(produto: Produto[]): Produto[] {
    return produto
  }

  camposPreenchidos(): boolean
  {
    return this.cartaoCliente.rfid != ''  && this.produtoSelecionado.nome != '' && this.quantidade > 0;
  }
  
  carrinhoPreenchido(): boolean
  {
    return this.cartaoCliente.produtos_cafeteria.length > 0
  }
  rfidClientePreenchido(): boolean
  {
    return this.cartaoCliente.rfid != ''
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
