import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Usuario} from "../entity/Usuario";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string = "http://localhost:8080/usuarios";

  constructor(private http: HttpClient) { }

  carregarUsuario(cpf: String):Observable<Usuario>{
    return this.http.get<Usuario>(this.url + '/' + cpf);
  }
}
