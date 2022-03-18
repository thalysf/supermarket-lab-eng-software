import { Usuario } from './../entity/Usuario';
import { Tela } from './../entity/Tela';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioTelaService {

  urlTela:string = "";
  urlUsuario:string = "";

  constructor(private http: HttpClient) { }

  carregarTelas():Observable<Tela[]>{
    return this.http.get<Tela[]>(this.urlTela); 
  }

  carregarUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlUsuario);
  }

  criarUsuario(usuario:Usuario):void{
    this.http.post<Usuario>(this.urlUsuario, usuario).subscribe(retorno =>{
      // TODO
    });
  }

  atualizarUsuario(usuario:Usuario):void{
    this.http.post<Usuario>(this.urlUsuario, usuario).subscribe(retorno =>{
      // TODO
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
