import { Produto } from './../../entity/Produto';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CadastroProdutoService } from 'src/app/services/cadastro-produto.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css']
})
export class CadastroProdutoComponent implements AfterViewInit {


  nome: string = "";
  precoVenda: number = 0;
  precoCompra: number = 0;
  imagem = [];
  codigoBarras: string = "";
  //fracionado: string[] = ['sim', 'não'];
  qtdEstoque: number = 0;
  setor: string = "";
  rfid: string = "";
  produtos: Produto[] = [];

  displayedColumns: string[] = ['nome', 'preco_compra', 'preco_venda', 'codigo_barras', 'quantidade'];

  dataSource = new MatTableDataSource<Produto>(this.produtos);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public cadastroProdutoService: CadastroProdutoService, private toastr: ToastrService) {
    this.carregarProduto();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
  }

  cadastrar() {
    const produto: Produto = {
      nome: this.nome,
      preco_venda: this.precoVenda,
      preco_compra: this.precoCompra,
      //imagem: this.imagem,
      //fracionado: this.fracionado,
      codigo_barras: this.codigoBarras,
      quantidade: this.qtdEstoque,
      setor: this.setor,
      RFID: this.rfid,
    }

    this.cadastroProdutoService.cadastrarProduto(produto).subscribe(
      data => this.cadastrar,
      error => this.toastr.error('Não foi possível Cadastrar o Produto')
    );

    this.carregarProduto();

  }

  atualizar() {

  }

  deletar() {

  }

  limpar() {
    this.nome = "";
    this.precoVenda = 0;
    this.precoCompra = 0;
    this.imagem = [];
    //this.fracionado = true;
    this.codigoBarras = "";
    this.qtdEstoque = 0;
    this.setor = "";
    this.rfid = "";
  }

  carregarProduto() {
    this.cadastroProdutoService.carregarProduto().subscribe((produto: Produto[]) =>
      this.dataSource.data = this.produtoFunc(produto)
    )
  }

  produtoFunc(produto: Produto[]): Produto[] {
    console.log(produto);
    return produto
  }

}
