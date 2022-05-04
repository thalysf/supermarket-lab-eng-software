import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  url: string = "http://localhost:8082/relatorios"

  constructor(private http: HttpClient) { }

  gerarRelatorioSetor(dataInicio:any, dataFim:any){
    var body = {
      dataInicio: dataInicio,
      dataFim: dataFim
    }
  }
}
