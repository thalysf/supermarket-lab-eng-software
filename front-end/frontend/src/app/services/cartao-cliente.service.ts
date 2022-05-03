import { CartaoCliente } from './../entity/CartaoCliente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartaoClienteService {
  urlCartaoCliente:string = "http://localhost:8080/cartaocliente";

  constructor(private http: HttpClient) { }

  carregarCartoesClientes():Observable<CartaoCliente[]>{
    return this.http.get<CartaoCliente[]>(this.urlCartaoCliente);
  }

  criarCartaoCliente(cartaoCliente:CartaoCliente){
    return this.http.post<CartaoCliente>(this.urlCartaoCliente, cartaoCliente);
  }

  atualizarCartaoCliente(cartaoCliente:CartaoCliente){
    return this.http.put<CartaoCliente>(this.urlCartaoCliente, cartaoCliente);
  }

  excluirCartaoCliente(cartaoCliente:CartaoCliente){
    return this.http.delete<CartaoCliente>(this.urlCartaoCliente + "/" + cartaoCliente.rfid);
  }

  buscarCartaoClientePorRfid(rfid: string) {
    return this.http.get<CartaoCliente>(this.urlCartaoCliente + "/rfid/" + rfid);
  }
}
