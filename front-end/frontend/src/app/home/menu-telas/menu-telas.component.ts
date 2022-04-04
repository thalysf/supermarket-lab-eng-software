import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-telas',
  templateUrl: './menu-telas.component.html',
  styleUrls: ['./menu-telas.component.css']
})
export class MenuTelasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  veririficarUsuario(tela: string): boolean {
    if(localStorage.getItem('usuario')) {
      let usuario = JSON.parse(localStorage.getItem('usuario') || '');

      for(let i = 0; i < usuario.telas.length; i++ ) {
        if(usuario.telas[i].nome === tela) {
          return true;
        }
      }
      return false;
    }

    return false;

  }

}
