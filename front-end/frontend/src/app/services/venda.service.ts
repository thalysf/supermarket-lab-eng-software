import { ItemVenda } from './../entity/ItemVenda';
import { HttpClient } from '@angular/common/http';
import { Produto } from './../entity/Produto';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  urlUsuario:string = "http://localhost:8080/vendas";
  constructor(private http: HttpClient) { }

  realizarVenda(produtos:ItemVenda[]){
    return this.http.post<ItemVenda[]>(this.urlUsuario, produtos);
  }
}
