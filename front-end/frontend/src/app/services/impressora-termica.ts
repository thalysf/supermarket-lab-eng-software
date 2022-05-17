import { Injectable } from '@angular/core';
import { PrintService, UsbDriver } from "ng-thermal-print";

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
    if (!this.printerStatus) return;


    this.printService.init()
      .setBold(true)
      .writeLine("PRODUTO!!!!!!!!!!!!!!!!!!")
      .setBold(false)
      .writeLine(`------------------------------------------------`)
      .writeLine(`ITEM        DESCRICAO   QTDE        PRECO       `)
      .writeLine(`------------------------------------------------`)      
      .feed(3)

    for (let i = 0; i < produtosRecibo.length; i++) {

      let linha = `${i + 1}`.slice(0, 12).padEnd(12, ' ') +
        `${produtosRecibo[i].produto.nome}`.slice(0, 12).padEnd(12, ' ') +
        `${produtosRecibo[i].quantidade}`.slice(0, 12).padEnd(12, ' ') +
        `${produtosRecibo[i].produto.preco_venda}`.slice(0, 12).padEnd(12, ' ');

      this.printService
        .writeLine(linha)
        .feed(1)
        .flush()

    }

    this.printService
      .cut('full')
      .flush()
  }

}
