import { CartaoCliente } from './../entity/CartaoCliente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CafeteriaService {

  urlCafeteria:string = "http://localhost:8080/cafeteria";

  constructor(private http: HttpClient) { }


  carregarCartaoClientes():Observable<CartaoCliente[]>{
    return this.http.get<CartaoCliente[]>(this.urlCafeteria);
  }

  criarCartaoCliente(CartaoCliente:CartaoCliente){
    return this.http.post<CartaoCliente>(this.urlCafeteria, CartaoCliente);
  }

  atualizarCartaoCliente(CartaoCliente:CartaoCliente){
    return this.http.put<CartaoCliente>(this.urlCafeteria, CartaoCliente);
  }

  excluirCartaoCliente(CartaoCliente:CartaoCliente){
    return this.http.delete<CartaoCliente>(this.urlCafeteria + "/" + CartaoCliente.rfid);
  }
}
