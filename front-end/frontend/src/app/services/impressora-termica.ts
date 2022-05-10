import { Injectable } from '@angular/core';
import {PrintService, UsbDriver} from "ng-thermal-print";

@Injectable({
  providedIn: 'root'
})
export class ImpressoraTermicaService {

  printerStatus: boolean = false;
  usbPrintDriver: UsbDriver = new UsbDriver();

  constructor(private printService: PrintService) {
    this.printService.isConnected.subscribe((result) => {
      this.printerStatus = result;
    });
  }

  getLocalStorageImpressora(): void {
    if (localStorage.getItem("printer-device")) {
      const device = JSON.parse(localStorage.getItem("printer-device") || '');
      this.usbPrintDriver = new UsbDriver(device.vendorId, device.productId);
      const language = device.vendorId === 1208 ? "StarPRNT" : "ESC/POS";
      this.printService.setDriver(this.usbPrintDriver, language);
    }
  }

  async requestUsb(): Promise<void> {
    if (this.printerStatus) {
      return;
    }
    await new Promise(async (resolve, reject) => {
      if (this.printerStatus) {
        resolve(true);
      }
      this.usbPrintDriver.requestUsb().subscribe(
        (result) => {
          const language = result.vendorId === 1208 ? "StarPRNT" : "ESC/POS";
          localStorage.setItem(
            "printer-device",
            JSON.stringify({
              vendorId: result.vendorId,
              productId: result.productId,
            })
          );
          this.usbPrintDriver = new UsbDriver(
            result.vendorId,
            result.productId
          );
          this.printService.setDriver(this.usbPrintDriver, language);
          resolve(result);
        },
        () => resolve(true)
      );
    });
  }

  initPrinter(): void {
    this.printService.init();
  }

  imprimir(produtosRecibo: any): void {
    if(!this.printerStatus) return;
    var total = 0;
    var esc = '\x1B'; //ESC byte in hex notation
    var newLine = '\x0A'; //LF byte in hex notation
    var cmds = esc + "@"; //Initializes the printer (ESC @)
    cmds += esc + '!' + '\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
    cmds += 'PRODUTOS'; //text to print
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
    cmds += 'QUANTIDADE\tNOME\tPRECO\tVALOR';
    cmds += newLine;
    for (let i = 0; i < produtosRecibo.length; i++) {
      cmds += `${produtosRecibo[i].quantidade}\t\t${produtosRecibo[i].produto.nome}\t${produtosRecibo[i].produto.preco_venda}\t${produtosRecibo[i].produto.preco_venda * produtosRecibo[i].quantidade}`;
      cmds += newLine;
      total += produtosRecibo[i].produto.preco_venda * produtosRecibo[i].quantidade;
    }
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x18'; //Emphasized + Double-height mode selected (ESC ! (16 + 8)) 24 dec => 18 hex
    cmds += `# TOTAL: ${total}`;

    this.printService.init()
      .setSize('normal')
      .writeLine(cmds)
      .feed(4)
      .cut('full')
      .flush();
  }

}
