import { Venda } from './../entity/Venda';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  urlUsuario:string = "http://localhost:8080/vendas";
  constructor(private http: HttpClient) { }

  realizarVenda(venda:Venda){
    return this.http.post<Venda>(this.urlUsuario, venda);
  }
}
