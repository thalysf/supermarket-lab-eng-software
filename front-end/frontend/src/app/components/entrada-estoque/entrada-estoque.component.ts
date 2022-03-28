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

  produtoTeste:Produto = {
    codigo_barras: '7896359036844',
    quantidade: 1,
    nome: 'vrau'
  };

  dataSource = new MatTableDataSource<Produto>(this.produtos);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor( public entradaEstoqueService:EntradaEstoqueService ) { }

 
  ngAfterViewInit() : void {
    this.dataSource.paginator = this.paginator;
  }

  inserir(){

    // PEGA PRODUTO NO BANCO

    if(this.codigoBarras != ""){
      for(var p of this.produtos){
        if(p.codigo_barras === this.codigoBarras){
          p.quantidade += 1;
          this.codigoBarras = "";
          return;
        }
      }
      this.produtos.push(this.produtoTeste);
      this.dataSource.data =this.produtos; 
      this.codigoBarras = "";
    }
  }

  salvar(){
    for(var p of this.produtos){
      this.entradaEstoqueService.atualizarProduto(p);
    }
  }

  limpar(){
    this.codigoBarras = "";
  }
}
