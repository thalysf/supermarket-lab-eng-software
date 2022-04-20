import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BalancaService {

  porta:any;
  reader:any;

  constructor() { }

  getReader():any{
    return this.reader;
  }

  getPorta():any{
    return this.porta;
  }

  async inicializarPorta(){
    if(!this.porta){
      
      let navegador:any;
      navegador = window.navigator;
      if (navegador && navegador.serial) {
        const portas = await navegador.serial.getPorts();
        console.log(portas);
        if(localStorage.getItem('balancaIndex')){
          console.log(Number(localStorage.getItem('balancaIndex')))
          console.log(portas.length);
          this.porta = portas[Number(localStorage.getItem('balancaIndex')) - 1]; // retirar o -1
        }
        else {
          localStorage.setItem("balancaIndex", portas.length);
        }
      }
    }
  }
}
