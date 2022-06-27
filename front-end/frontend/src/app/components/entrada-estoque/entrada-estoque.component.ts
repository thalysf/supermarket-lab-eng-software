import { CadastroProdutoService } from './../../services/cadastro-produto.service';
import { ToastrService } from 'ngx-toastr';
import { EntradaEstoqueService } from './../../services/entrada-estoque.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Produto } from './../../entity/Produto';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-entrada-estoque',
  templateUrl: './entrada-estoque.component.html',
  styleUrls: ['./entrada-estoque.component.css']
})
export class EntradaEstoqueComponent implements AfterViewInit {

  codigoBarras:string = "";
  quantidade:number = 1;
  produtos:Produto[] = [];

  displayedColumns: string[] = ['nome', 'quantidade'];

  dataSource = new MatTableDataSource<Produto>(this.produtos);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor( public entradaEstoqueService:EntradaEstoqueService, private toastr:ToastrService, public cadastroProdutoService: CadastroProdutoService, private router: Router) {
    this.veririficarUsuario('ESTOQUE');
  }

  ngAfterViewInit() : void {
    this.dataSource.paginator = this.paginator;
    this.carregar();
    this.focusPrimeiroElementoFormulario();
  }

  inserir(){
    if(this.codigoBarras != ""){
      this.codigoBarras = this.codigoBarras.padStart(13, '0')
      this.entradaEstoqueService.carregarProduto(this.codigoBarras).subscribe(
        data=> this.atualizarProduto(data),
        error=>this.toastr.error('Não foi possível Adicionar o Produto')
      )
    } else {
      this.toastr.warning('Preencha o campo corretamente!');
    }
  }

  retirar(){
    if(this.codigoBarras != ""){
      this.entradaEstoqueService.carregarProduto(this.codigoBarras).subscribe(
        data=> this.retirarProduto(data),
        error=>this.toastr.error('Não foi possível Remover o Produto')
      )
    } else {
      this.toastr.warning('Preencha o campo corretamente!');
    }
  }

  atualizarProduto(produto:any){
    for(var p of this.produtos){
      if(p.codigo_barras === this.codigoBarras){
        p.qtd_estoque += this.quantidade;
        this.codigoBarras = "";
        this.quantidade = 1;
        return;
      }
    }
  }

  salvar(){
    var erro = 0;
    for(var p of this.produtos){
      this.entradaEstoqueService.atualizarProduto(p).subscribe(
        error=>erro = 1
      )
    }
    if(erro === 0)
      this.toastr.success('Estoque atualizado com sucesso!')
    else
      this.toastr.error('Não foi possível atualizar o estoque!')
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

  retirarProduto(produto:any){
    for(var p of this.produtos){
      if(p.codigo_barras === this.codigoBarras && p.qtd_estoque > 0){
        p.qtd_estoque -= this.quantidade;
        this.codigoBarras = "";
        this.quantidade = 1;
        return;
      }
    }
  }

  focusPrimeiroElementoFormulario(): void{
    let blurElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
    blurElement.blur();

    setTimeout(function(){
      let focusElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
      focusElement.focus();
    },0);
  }

  veririficarUsuario(tela: string) {
    if(localStorage.getItem('usuario')) {
      let usuario = JSON.parse(localStorage.getItem('usuario') || '');

      for(let i = 0; i < usuario.telas.length; i++ ) {
        if(usuario.telas[i].nome === tela) {
          return;
        }
      }
      return this.router.navigate(['/home']);
    }

    return this.router.navigate(['/login']);

  }
}
