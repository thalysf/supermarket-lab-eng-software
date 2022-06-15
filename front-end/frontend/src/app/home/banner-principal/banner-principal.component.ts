import { BalancaService } from './../../services/balanca.service';
import { RfidService } from './../../services/rfid.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner-principal',
  templateUrl: './banner-principal.component.html',
  styleUrls: ['./banner-principal.component.css']
})
export class BannerPrincipalComponent implements OnInit {

  constructor(public rfidService:RfidService, public balancaService:BalancaService) { 
  }

  ngOnInit(): void {
  }
}
