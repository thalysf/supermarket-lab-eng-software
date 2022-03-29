import { CadastroProdutoService } from './../../services/cadastro-produto.service';
import { ToastrService } from 'ngx-toastr';
import { EntradaEstoqueService } from './../../services/entrada-estoque.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Produto } from './../../entity/Produto';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-entrada-estoque',
  templateUrl: './entrada-estoque.component.html',
  styleUrls: ['./entrada-estoque.component.css']
})
export class EntradaEstoqueComponent implements AfterViewInit {
  
  codigoBarras:string = "";
  produtos:Produto[] = [];

  displayedColumns: string[] = ['nome', 'quantidade'];

  dataSource = new MatTableDataSource<Produto>(this.produtos);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor( public entradaEstoqueService:EntradaEstoqueService, private toastr:ToastrService, public cadastroProdutoService: CadastroProdutoService) { }

 
  ngAfterViewInit() : void {
    this.dataSource.paginator = this.paginator;
    this.carregar();
  }

  inserir(){
    // PEGA PRODUTO NO BANCO
    if(this.codigoBarras != ""){
      this.entradaEstoqueService.carregarProduto(this.codigoBarras).subscribe(
        data=> this.atualizarProduto(data),
        error=>this.toastr.error('Não foi possível Adicionar o Produto')
      )
    }
  }

  atualizarProduto(produto:any){
    for(var p of this.produtos){
      if(p.codigo_barras === this.codigoBarras){
        p.qtd_estoque += 1;
        this.codigoBarras = "";
        return;
      }
    }
    produto.qtd_estoque += 1;
    this.produtos.push(produto);
    this.dataSource.data =this.produtos; 
    this.codigoBarras = "";
  }

  salvar(){
    for(var p of this.produtos){
      this.entradaEstoqueService.atualizarProduto(p).subscribe(
        data=> this.toastr.success('Operação feita'),
        error=>this.toastr.error('Não foi possível Salvar os Produtos')
      )
    }
  }

  carregar(){
    this.cadastroProdutoService.carregarProduto().subscribe((produtos: Produto[]) =>
      this.carregarListaProdutos(produtos)
    )
  }

  carregarListaProdutos(produtos: Produto[]): void {
    this.produtos = produtos;
    this.dataSource.data = this.produtos;
  }

  limpar(){
    this.codigoBarras = "";
  }
}
