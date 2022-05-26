import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-codigo-barras',
  templateUrl: './codigo-barras.component.html',
  styleUrls: ['./codigo-barras.component.css']
})
export class CodigoBarrasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  imprimirCodigoBarras(): void{
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow?.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow?.document.write('</head><body style="display:flex; margin-left: 2 !important;">');
    var element = document.getElementById("codigobarras") as HTMLInputElement
    mywindow?.document.write(element.innerHTML);
    mywindow?.document.write('</body></html>');

    mywindow?.document.close();
    mywindow?.focus();

    mywindow?.print();
    mywindow?.close();
  }

}
