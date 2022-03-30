import { Produto } from './../../entity/Produto';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CadastroProdutoService } from 'src/app/services/cadastro-produto.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css']
})
export class CadastroProdutoComponent implements AfterViewInit {


  nome: string = "";
  precoVenda: number = 0;
  precoCompra: number = 0;
  imagem: any;
  codigoBarras: string = "";
  fracionado = false;
  qtdEstoque: number = 0;
  setor: string = "";
  rfid: string = "";
  produtos: Produto[] = [];

  fileSelected?:Blob;
  imageUrl?:string;

  displayedColumns: string[] = ['nome', 'preco_compra', 'preco_venda', 'codigo_barras', 'RFID', 'quantidade', 'fracionado', 'acao'];

  dataSource = new MatTableDataSource<Produto>(this.produtos);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public cadastroProdutoService: CadastroProdutoService, 
    private toastr: ToastrService, private sant:DomSanitizer) {
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
      imagem: [],
      fracionado: this.fracionado,
      codigo_barras: this.codigoBarras,
      qtd_estoque: this.qtdEstoque,
      setor: this.setor,
      rfid: this.rfid,
    }

    this.cadastroProdutoService.cadastrarProduto(produto).subscribe(
      data => this.carregarProduto(),
      error => this.toastr.error('Não foi possível Cadastrar o Produto')
    );
  }

  atualizar() {
    const produto: Produto = {
      nome: this.nome,
      preco_venda: this.precoVenda,
      preco_compra: this.precoCompra,
      imagem: [],
      fracionado: this.fracionado,
      codigo_barras: this.codigoBarras,
      qtd_estoque: this.qtdEstoque,
      setor: this.setor,
      rfid: this.rfid,
    }
    this.cadastroProdutoService.atualizarProduto(produto).subscribe(
      data => this.carregarProduto(),
      error => this.toastr.error('Não foi possível Atualizar o Produto')
    )

  }

  deletar(produto:any) {
    this.cadastroProdutoService.deletarProduto(produto.rfid).subscribe(
      data => this.carregarProduto(),
      error => this.toastr.error('Não foi possível Excluir o Produto')
    )
  }

  limpar() {
    this.nome = "";
    this.precoVenda = 0;
    this.precoCompra = 0;
    this.imagem = [];
    this.fracionado = false;
    this.codigoBarras = "";
    this.qtdEstoque = 0;
    this.setor = "";
    this.rfid = "";
    this.imagem = null;
    this.fileSelected = new Blob();
    this.imageUrl = "";
  }

  carregarProduto() {
    this.cadastroProdutoService.carregarProduto().subscribe((produto: Produto[]) =>
      this.carregarListaProdutos(produto)
    )
  }

  carregarListaProdutos(produtos: Produto[]): void {
    this.produtos = produtos;
    this.dataSource.data = this.produtos;
  }

  produtoFunc(produto: Produto[]): Produto[] {
    console.log(produto);
    return produto
  }

  onSelectNewImage(event:any){
    const target = event.target as HTMLInputElement;
    this.fileSelected = target!.files![0];
    this.imageUrl = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileSelected)) as string
  
    this.convertFileToBase64();
  }

  convertFileToBase64(){
    let reader=new FileReader();
    reader.readAsDataURL(this.fileSelected as Blob);
    reader.onloadend = () =>{
      this.imagem = reader.result as string;
      console.log(this.imagem);
    }
  }
}
