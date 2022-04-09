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
  produtos: Produto[] = [];
  rfid: string = "";
  cartaoCliente: CartaoCliente = {rfid: '', produtosCafeteria: []};
  produtoSelecionado: Produto = {codigo_barras: '', nome: '', qtd_estoque: 0};
  quantidade: number= 0;

  displayedColumns: string[] = ['produtoSelecionado', 'quantidade', 'acao'];

  dataSourceCarrrinho = new MatTableDataSource<ItemVenda>(this.cartaoCliente.produtosCafeteria);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public cadastroProdutoService: CadastroProdutoService,
    private toastr: ToastrService, private sant: DomSanitizer, private router: Router) {
    this.veririficarUsuario('CAFETERIA');
    this.carregarProduto();
  }
  ngAfterViewInit(): void {
    this.dataSourceCarrrinho.paginator = this.paginator;
  }

  ngOnInit(): void {
    
  }

  addCarrinho(produtoSelecionado: Produto, qtd: number, rfid: string): void {
    let itemVenda: ItemVenda = {produto: produtoSelecionado, quantidade: qtd}

    this.cartaoCliente.rfid = rfid;
    this.cartaoCliente.produtosCafeteria.push(itemVenda);

    this.dataSourceCarrrinho.data = this.cartaoCliente.produtosCafeteria;
  }

  updateCartaoCliente(): void{

  }

  removerCarrinho(index: any): void{
    this.cartaoCliente.produtosCafeteria.splice(index, 1);
    this.dataSourceCarrrinho.data = this.cartaoCliente.produtosCafeteria;
  }

  async cadastrar() {
    // const produto: Produto = {
    //   nome: this.nome,
    //   preco_venda: this.precoVenda,
    //   preco_compra: this.precoCompra,
    //   imagem: this.imagem,
    //   fracionado: this.fracionado,
    //   codigo_barras: this.codigoBarras,
    //   qtd_estoque: this.qtdEstoque,
    //   setor: this.setor,
    //   rfid: this.rfid,
    // }

    // this.cadastroProdutoService.cadastrarProduto(produto).subscribe(
    //   data => this.carregarProduto(),
    //   error => this.toastr.error('Não foi possível Cadastrar o Produto')
    // );
  }



  atualizar() {
    // const produto: Produto = {
    //   nome: this.nome,
    //   preco_venda: this.precoVenda,
    //   preco_compra: this.precoCompra,
    //   imagem: this.imagem,
    //   fracionado: this.fracionado,
    //   codigo_barras: this.codigoBarras,
    //   qtd_estoque: this.qtdEstoque,
    //   setor: this.setor,
    //   rfid: this.rfid,
    // }
    // this.cadastroProdutoService.atualizarProduto(produto).subscribe(
    //   data => this.carregarProduto(),
    //   error => this.toastr.error('Não foi possível Atualizar o Produto')
    // )

  }

  deletar(produto: any) {
    // this.cadastroProdutoService.deletarProduto(produto.rfid).subscribe(
    //   data => this.carregarProduto(),
    //   error => this.toastr.error('Não foi possível Excluir o Produto')
    // )
  }

  limpar() {
    // this.nome = "";
    // this.precoVenda = 0;
    // this.precoCompra = 0;
    // this.imagem = [];
    // this.fracionado = false;
    // this.codigoBarras = "";
    // this.qtdEstoque = 0;
    // this.setor = "";
    // this.rfid = "";
    // this.imagem = null;
    // this.fileSelected = new Blob();
    // this.imageUrl = "";
  }

  carregarProduto() {
    this.cadastroProdutoService.carregarProduto().subscribe((produto: Produto[]) =>
      this.carregarListaProdutos(produto)
    )
  }

  carregarListaProdutos(produtos: Produto[]): void {
    this.produtos = produtos;
    //this.dataSource.data = this.produtos;
  }

  produtoFunc(produto: Produto[]): Produto[] {
    return produto
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