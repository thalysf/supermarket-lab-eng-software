import { Produto } from './../entity/Produto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntradaEstoqueService {

  urlProdutos:string = "http://localhost:8082/produtos";

  constructor(private http: HttpClient) { }

  carregarProduto(codBarras:string):Observable<Produto>{
    return this.http.get<Produto>(this.urlProdutos + '/' + codBarras);
  }

  atualizarProduto(produto:Produto){
    return this.http.put<Produto>(this.urlProdutos, produto);
  }
}
