import {RelatorioService} from './../../services/relatorio.service';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  dataInicio: any;
  dataFim: any;

  constructor(private router: Router, private relatorioService: RelatorioService, private toastr: ToastrService) {
    this.veririficarUsuario('RELATORIOS');
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() : void {
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  gerarRelatorioPorSetor() {
    if (this.datasValidas()) {
      window.open("http://localhost:8080/relatorios/setor/" + this.dataInicio + '/' + this.dataFim, "_blank");
    } else {
      this.toastr.error("Preencha as datas corretamente!");
    }
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  gerarRelatorioPorProduto() {
    if (this.datasValidas()) {
      window.open("http://localhost:8080/relatorios/produto/" + this.dataInicio + '/' + this.dataFim, "_blank");
    } else {
      this.toastr.error("Preencha as datas corretamente!");
    }
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  gerarRelatorioPorCliente() {
    if (this.datasValidas()) {
      window.open("http://localhost:8080/relatorios/cliente/" + this.dataInicio + '/' + this.dataFim, "_blank");
    } else {
      this.toastr.error("Preencha as datas corretamente!");
    }
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  gerarRelatorioPorTipo() {
    if (this.datasValidas()) {
      window.open("http://localhost:8080/relatorios/tipo/" + this.dataInicio + '/' + this.dataFim, "_blank");
    } else {
      this.toastr.error("Preencha as datas corretamente!");
    }
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }


  datasValidas() {
    if (typeof (this.dataInicio) === 'undefined' || typeof (this.dataFim) === 'undefined') {
      return false
    }

    const data01 = new Date(this.dataInicio).getTime();
    const data02 = new Date(this.dataFim).getTime();

    if (data01 <= data02) {
      return true;
    } else {
      return false;
    }
  }

  limpar(): void{
    this.dataInicio = null;
    this.dataFim = null;
  }

  focusPrimeiroElementoFormulario(): void {
    let blurElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
    blurElement.blur();

    setTimeout(function () {
      let focusElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
      focusElement.focus();
    }, 0);
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
