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

  criarUsuario(usuario:Usuario){
    return this.http.post<Usuario>(this.urlUsuario, usuario);
  }

  atualizarUsuario(usuario:Usuario){
    return this.http.put<Usuario>(this.urlUsuario, usuario);
  }

  excluirUsuario(usuario:Usuario){
    return this.http.delete<Usuario>(this.urlUsuario + "/" + usuario.cpf);
  }
}
