import { HttpClient } from '@angular/common/http';
import { Produto } from './../entity/Produto';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  urlUsuario:string = "http://localhost:8082/produtos";
  constructor(private http: HttpClient) { }

  realizarVenda(produtos:Produto[]){
    return this.http.post<Produto[]>(this.urlUsuario, produtos);
  }
}
