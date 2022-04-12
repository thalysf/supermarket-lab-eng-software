import { Component, OnInit } from '@angular/core';
import {ItemVenda} from "../../../entity/ItemVenda";

@Component({
  selector: 'app-imprime-venda',
  templateUrl: './imprime-venda.component.html',
  styleUrls: ['./imprime-venda.component.css']
})
export class ImprimeVendaComponent implements OnInit {
  itensVendas: ItemVenda[] = [];
  constructor() {
   this.setarItensVendas();
  }

  ngOnInit(): void {
  }

  setarItensVendas() {
    this.itensVendas = JSON.parse(localStorage.getItem('itensVendas') || '');
  }

  imprimir() {
    window.print();
  }

}
