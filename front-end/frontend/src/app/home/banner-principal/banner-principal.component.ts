import { RfidService } from './../../services/rfid.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner-principal',
  templateUrl: './banner-principal.component.html',
  styleUrls: ['./banner-principal.component.css']
})
export class BannerPrincipalComponent implements OnInit {

  constructor(private rfidService:RfidService) { 
    this.rfidService.readerRfid();
  }

  navegador:any;

  ngOnInit(): void {
  }
}
