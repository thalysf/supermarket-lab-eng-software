import { Usuario } from './../entity/Usuario';
import { Produto } from './../entity/Produto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CadastroProdutoService {

  urlProdutos:string = "http://localhost:8080/produtos";

  constructor(private http: HttpClient) { }

  cadastrarProduto(produto:Produto){
    return this.http.post<Produto>(this.urlProdutos, produto);
  }

  atualizarProduto(produto:Produto){
    return this.http.put<Produto>(this.urlProdutos, produto);
  }

  carregarProduto():Observable<Produto[]>{
    return this.http.get<Produto[]>(this.urlProdutos);
  }

  carregarProdutoPorSetor(setor: string):Observable<Produto[]>{
    const urlSetor = this.urlProdutos + "/setor/" + setor;
    return this.http.get<Produto[]>(urlSetor);
  }

 buscarProdutoPorCodigoDeBarras(codigoBarras: string):Observable<Produto>{
    const urlSetor = this.urlProdutos + "/codigo-barras/" + codigoBarras;
    return this.http.get<Produto>(urlSetor);
  }

  deletarProduto(rfid:any){
    return this.http.delete<Produto>(this.urlProdutos + "/" + rfid);
  }
}

