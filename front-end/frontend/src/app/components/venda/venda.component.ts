import { VendaService } from './../../services/venda.service';
import { ToastrService } from 'ngx-toastr';
import { EntradaEstoqueService } from './../../services/entrada-estoque.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Produto } from './../../entity/Produto';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.css']
})
export class VendaComponent implements OnInit {

  produtos:Produto[] = [];
  produtoAtual:any;

  codigo:any;
  quantidade:any = 1;
  precoUnitario:any;
  total:any = 0;
  imagem:any;
  precoTotalProduto:any;
  fracionado:boolean = false;

  displayedColumns: string[] = ["nome", "quantidade", "precoUnidade", "precoTotalProduto", "imagem", "acao"];
  dataSource = new MatTableDataSource<Produto>(this.produtos);
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  constructor(public entradaEstoqueService:EntradaEstoqueService, private toastr: ToastrService, private vendaSerive:VendaService) { }

  ngOnInit(): void {
  }

  inserir(){
    if(this.produtoAtual != null){

      for(let produto of this.produtos){
        if(produto.codigo_barras === this.codigo){
          produto.qtd_estoque += this.quantidade;
          this.limpar();
          return;
        }
      }

      this.produtoAtual.qtd_estoque = this.quantidade;
      this.produtoAtual.preco_compra = this.precoTotalProduto;
      this.produtos.push(this.produtoAtual);
      this.dataSource.data = this.produtos;

      this.total += this.precoTotalProduto;

      this.limpar();
    }
  }

  limpar(){
    this.produtoAtual = null;
    this.codigo = "";
    this.quantidade = 1;
    this.precoUnitario = 0;
    this.precoTotalProduto = 0;
  }

  finalizarCompra(){
    this.vendaSerive.realizarVenda(this.produtos).subscribe(
      data=>this.toastr.success('Venda realizada com sucesso'),
      error=>this.toastr.error('Não foi possível realizar a venda')
    )
  }

  onChangeCodigo(event:any){
    var texto = event.target.value;

    if(texto.length == 12){
      this.entradaEstoqueService.carregarProduto(texto).subscribe(
        data=> this.carregarProduto(data),
        error=>this.toastr.error('Não foi possível encontrar o Produto')
      )
    }
  }

  carregarProduto(produto:any){
    this.imagem = produto.imagem;
    this.precoUnitario = produto.preco_venda;
    this.produtoAtual = produto;
    if(this.quantidade){
      this.precoTotalProduto = this.quantidade * this.precoUnitario;
    }
  }

  excluir(produto:any){
    for(var i =0; i < this.produtos.length; i++){
      if(this.produtos[i].codigo_barras == produto.codigo_barras){
        this.total -= this.produtos[i].qtd_estoque * (this.produtos[i].preco_venda || 1);
        this.produtos.splice(i, 1);
        this.dataSource.data = this.produtos;
      }
    }
  }

  expandeImagem(id: any) {
    console.log(id)
    let img = document.getElementById(id)
    if (img) {
      img.style.transform = "scale(2)";
      img.style.transition = "transform 0.25s ease";
      img.style.zIndex = '2'
    }
  }
  diminuiImagem(id: any) {
    let img = document.getElementById(id)
    if (img) {
      img.style.transform = "scale(1)";
      img.style.transition = "transform 0.25s ease";
      img.style.zIndex = '1'
    }
  }

  calcularPrecoTotalProduto(){
    this.precoTotalProduto = this.quantidade * this.precoUnitario;
  }
}
