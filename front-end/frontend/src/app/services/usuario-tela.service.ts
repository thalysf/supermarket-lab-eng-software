import { Usuario } from './../entity/Usuario';
import { Tela } from './../entity/Tela';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioTelaService {

  urlTela:string = "http://localhost:8082/telas";
  urlUsuario:string = "http://localhost:8082/usuarios";

  constructor(private http: HttpClient) { }

  carregarTelas(){
    return this.http.get<Tela[]>(this.urlTela);
  }

  carregarUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlUsuario);
  }

  criarUsuario(usuario:Usuario):void{
    this.http.post<Usuario>(this.urlUsuario, usuario).subscribe(retorno =>{
      console.log(retorno)
    });
  }

  atualizarUsuario(usuario:Usuario):void{
    this.http.put<Usuario>(this.urlUsuario, usuario).subscribe(retorno =>{
      console.log(retorno)
    });
  }

  excluirUsuario(usuario:Usuario):void{

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: usuario.cpf
      },
    };

    this.http.delete<Usuario>(this.urlUsuario, options).subscribe(retorno =>{
      // TODO
    });
  }
}
