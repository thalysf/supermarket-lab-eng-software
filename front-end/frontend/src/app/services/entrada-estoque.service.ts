import { Produto } from './../entity/Produto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntradaEstoqueService {

  urlProdutos:string = "http://localhost:8082/estoques";

  constructor(private http: HttpClient) { }

  carregarProduto(codBarras:string):Observable<Produto>{
    return this.http.get<Produto>(this.urlProdutos + '/codigo_barras/' + codBarras);
  }

  atualizarProduto(produto:Produto){
    const estoque = {
      codigo_barras: produto.codigo_barras,
      qtd_estoque: produto.qtd_estoque
    }
    return this.http.put<Produto>(this.urlProdutos, estoque);
  }
}
