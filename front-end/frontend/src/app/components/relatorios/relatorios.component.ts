import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  gerarRelatorio(){

    window.open("http://localhost:8082/relatorios", "_blank");
  }
}
