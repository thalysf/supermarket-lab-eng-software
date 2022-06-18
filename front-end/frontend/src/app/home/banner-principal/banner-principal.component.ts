import { BalancaService } from './../../services/balanca.service';
import { RfidService } from './../../services/rfid.service';
import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-banner-principal',
  templateUrl: './banner-principal.component.html',
  styleUrls: ['./banner-principal.component.css']
})
export class BannerPrincipalComponent implements OnInit {
  nomeUsuarioLogado?: string;
  constructor(public rfidService:RfidService, public balancaService:BalancaService, public router: Router) {
  }

  ngOnInit(): void {
    this.nomeUsuarioLogado = JSON.parse(localStorage.getItem('usuario') || '').nome;
  }

  logout(): void{
    localStorage.removeItem("usuario");
    this.router.navigate(['/login']);
  }
}
