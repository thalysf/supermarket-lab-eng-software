import { ItemVenda } from './../../entity/ItemVenda';
import { VendaService } from './../../services/venda.service';
import { ToastrService } from 'ngx-toastr';
import { EntradaEstoqueService } from './../../services/entrada-estoque.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Produto } from './../../entity/Produto';
import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.css']
})
export class VendaComponent implements OnInit {

  produtos:ItemVenda[] = [];
  produtoAtual:any;

  codigo:any;
  quantidade:any = 1;
  precoUnitario:any;
  total:any = 0;
  imagem:any;
  precoTotalProduto:any;
  fracionado:boolean = false;

  openDialog: boolean = false;

  displayedColumns: string[] = ["nome", "quantidade", "precoUnidade", "precoTotalProduto", "imagem", "acao"];
  dataSource = new MatTableDataSource<ItemVenda>(this.produtos);
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  constructor(public entradaEstoqueService:EntradaEstoqueService, private toastr: ToastrService, private vendaSerive:VendaService, private router: Router) { }

  ngOnInit(): void {
  }

  inserir(){
    if(this.produtoAtual != null){

      for(let produto of this.produtos){
        if(produto.produto.codigo_barras === this.codigo){
          produto.quantidade += this.quantidade;
          this.limpar();
          return;
        }
      }

      let novoItemVenda:ItemVenda = {
        quantidade: this.quantidade,
        produto: this.produtoAtual
      }

      this.produtos.push(novoItemVenda);
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
    this.fracionado = produto.fracionado
    if(this.quantidade){
      this.precoTotalProduto = this.quantidade * this.precoUnitario;
    }
  }

  excluir(produto:any){
    for(var i =0; i < this.produtos.length; i++){
      if(this.produtos[i].produto.codigo_barras == produto.produto.codigo_barras){
        this.total -= this.produtos[i].quantidade * (this.produtos[i].produto.preco_venda || 1);
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

  imprimir(){
    localStorage.setItem("itensVendas", JSON.stringify(this.produtos));
    this.router.navigate(['/imprime-venda']);

  }
}
