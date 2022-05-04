import { RelatorioService } from './../../services/relatorio.service';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  dataInicio:any;
  dataFim:any;

  constructor(private router: Router, private relatorioService:RelatorioService) {
    this.veririficarUsuario('RELATORIOS');
   }

  ngOnInit(): void {
  }

  gerarRelatorio(){

    window.open("http://localhost:8080/relatorios", "_blank");
  }



  gerarRelatorioPorSetor(){

    window.open("http://localhost:8082/relatorios/setor/" + this.dataInicio + '/' + this.dataFim, "_blank");
    //this.relatorioService.gerarRelatorioSetor(this.dataInicio, this.dataFim);
  }

  veririficarUsuario(tela: string) {
    if (localStorage.getItem('usuario')) {
      let usuario = JSON.parse(localStorage.getItem('usuario') || '');

      for (let i = 0; i < usuario.telas.length; i++) {
        if (usuario.telas[i].nome === tela) {
          return;
        }
      }
      return this.router.navigate(['/home']);
    }
    return this.router.navigate(['/login']);
  }
}
