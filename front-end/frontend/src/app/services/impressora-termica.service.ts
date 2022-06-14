import { Injectable } from '@angular/core';
import { PrintService, UsbDriver } from "ng-thermal-print";
import {ItemVenda} from "../entity/ItemVenda";

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
      this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
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
          this.printService.setDriver(this.usbPrintDriver, "ESC/POS");
          resolve(result);
        },
        () => resolve(true)
      );
    });
  }

  initPrinter(): void {
    this.printService.init();
  }

  imprimir(produtosRecibo: ItemVenda[]): void {

    this.printService.init()
      .setBold(true)
      .writeLine("PRODUTO")
      .setBold(false)
      .writeLine(`------------------------------------------------`)
      .writeLine(`ITEM        NOME        QTDE        TOTAL PROD  `)
      .writeLine(`------------------------------------------------`)

    let total = 0;
    for (let i = 0; i < produtosRecibo.length; i++) {
      total += produtosRecibo[i].quantidade * (produtosRecibo[i].produto.preco_venda || 0 );
      let linha = `${i + 1}`.slice(0, 12).padEnd(12, ' ') +
        `${produtosRecibo[i].produto.nome}`.slice(0, 12).padEnd(12, ' ') +
        `${produtosRecibo[i].quantidade}`.slice(0, 12).padEnd(12, ' ') +
        `${produtosRecibo[i].quantidade * (produtosRecibo[i].produto.preco_venda || 0 )}`.slice(0, 12).padEnd(12, ' ');

      this.printService
        .writeLine(linha)
        .feed(1)
        .flush()

    }

    this.printService
      .writeLine(`TOTAL GERAL: ${total}`.slice(0, 48).padEnd(48, ' '))
      .feed(1)
      .cut('full')
      .flush()
  }

  imprimirTeste(): void {
    var esc = '\x1B'; //ESC byte in hex notation
    var newLine = '\x0A'; //LF byte in hex notation

    var cmds = esc + "@"; //Initializes the printer (ESC @)
    cmds += esc + '!' + '\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
    cmds += 'BEST DEAL STORES'; //text to print
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
    cmds += 'COOKIES                   5.00';
    cmds += newLine;
    cmds += 'MILK 65 Fl oz             3.78';
    cmds += newLine + newLine;
    cmds += 'SUBTOTAL                  8.78';
    cmds += newLine;
    cmds += 'TAX 5%                    0.44';
    cmds += newLine;
    cmds += 'TOTAL                     9.22';
    cmds += newLine;
    cmds += 'CASH TEND                10.00';
    cmds += newLine;
    cmds += 'CASH DUE                  0.78';
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x18'; //Emphasized + Double-height mode selected (ESC ! (16 + 8)) 24 dec => 18 hex
    cmds += '# ITEMS SOLD 2';
    cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
    cmds += newLine + newLine;
    cmds += '11/03/13  19:53:17';

    this.printService.init()
      .setSize('normal')
      .writeLine(cmds)
      .feed(4)
      .cut('full')
      .flush();
  }

}
