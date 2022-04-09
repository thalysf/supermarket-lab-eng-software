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

  criarCartaoCliente(cartaoCliente:CartaoCliente){
    return this.http.post<CartaoCliente>(this.urlCafeteria, cartaoCliente);
  }

  atualizarCartaoCliente(cartaoCliente:CartaoCliente){
    return this.http.put<CartaoCliente>(this.urlCafeteria, cartaoCliente);
  }

  excluirCartaoCliente(cartaoCliente:CartaoCliente){
    return this.http.delete<CartaoCliente>(this.urlCafeteria + "/" + cartaoCliente.rfid);
  }
}
