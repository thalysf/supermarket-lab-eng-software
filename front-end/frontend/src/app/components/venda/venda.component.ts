import { Router } from '@angular/router';
import { ItemVenda } from './../../entity/ItemVenda';
import { VendaService } from './../../services/venda.service';
import { ToastrService } from 'ngx-toastr';
import { EntradaEstoqueService } from './../../services/entrada-estoque.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Produto } from './../../entity/Produto';
import { Component, OnInit, ViewChild } from '@angular/core';
import {PrintService, UsbDriver} from "ng-thermal-print";

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.css']
})
export class VendaComponent implements OnInit {

  produtos:ItemVenda[] = [];
  produtoAtual:any;

  porta:any;
  reader:any;

  codigo:any;
  quantidade:any = 1;
  precoUnitario:any;
  total:any = 0;
  imagem:any;
  precoTotalProduto:any;
  fracionado:boolean = false;

  displayedColumns: string[] = ["nome", "quantidade", "precoUnidade", "precoTotalProduto", "imagem", "acao"];
  dataSource = new MatTableDataSource<ItemVenda>(this.produtos);

  status: boolean = false;
  usbPrintDriver: UsbDriver;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  constructor(public entradaEstoqueService:EntradaEstoqueService, private toastr: ToastrService,
    private vendaSerive:VendaService, private router: Router, private printService: PrintService) {
      this.usbPrintDriver = new UsbDriver();
      this.printService.isConnected.subscribe(result => {
        this.status = result;
        if (result) {
          console.log('Connected to printer!!!');
        } else {
          console.log('Not connected to printer.');
        }
      });
  }

  ngOnInit(): void {
  }

  requestUsb() {
    this.usbPrintDriver.requestUsb().subscribe(result => {
      this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
    });
  }

  inserir(){
    if(this.produtoAtual != null){

      for(let produto of this.produtos){
        if(produto.produto.codigo_barras === this.codigo){
          produto.quantidade += this.quantidade;
          this.limpar();
          return;
        }
      }

      let novoItemVenda:ItemVenda = {
        quantidade: this.quantidade,
        produto: this.produtoAtual
      }

      this.produtos.push(novoItemVenda);
      this.dataSource.data = this.produtos;

      this.total += this.precoTotalProduto;

      this.limpar();
    }
  }

  limpar(){
    this.produtoAtual = null;
    this.codigo = "";
    this.quantidade = 1;
    this.precoUnitario = 0;
    this.precoTotalProduto = 0;
  }

  finalizarCompra(){
    this.vendaSerive.realizarVenda(this.produtos).subscribe(
      data=>this.vendaSucesso(),
      error=>this.toastr.error('Não foi possível realizar a venda')
    )
  }

  vendaSucesso(){
    this.toastr.success('Venda realizada com sucesso');
    this.limpar();
  }


  onChangeCodigo(event:any){
    var texto = event.target.value;

    if(texto.length == 12){
      this.entradaEstoqueService.carregarProduto(texto).subscribe(
        data=> this.carregarProduto(data),
        error=>this.toastr.error('Não foi possível encontrar o Produto')
      )
    }
  }

  carregarProduto(produto:any){
    this.imagem = produto.imagem;
    this.precoUnitario = produto.preco_venda;
    this.produtoAtual = produto;
    this.fracionado = produto.fracionado
    if(this.quantidade){
      this.precoTotalProduto = this.quantidade * this.precoUnitario;
    }
  }

  excluir(produto:any){
    for(var i =0; i < this.produtos.length; i++){
      if(this.produtos[i].produto.codigo_barras == produto.produto.codigo_barras){
        this.total -= this.produtos[i].quantidade * (this.produtos[i].produto.preco_venda || 1);
        this.produtos.splice(i, 1);
        this.dataSource.data = this.produtos;
      }
    }
  }

  expandeImagem(id: any) {
    console.log(id)
    let img = document.getElementById(id)
    if (img) {
      img.style.transform = "scale(2)";
      img.style.transition = "transform 0.25s ease";
      img.style.zIndex = '2'
    }
  }
  diminuiImagem(id: any) {
    let img = document.getElementById(id)
    if (img) {
      img.style.transform = "scale(1)";
      img.style.transition = "transform 0.25s ease";
      img.style.zIndex = '1'
    }
  }

  calcularPrecoTotalProduto(){
    this.precoTotalProduto = this.quantidade * this.precoUnitario;
  }


  async readerBalanca(): Promise<any> {
    if(this.fracionado){
    let navegador: any;

    navegador = window.navigator;

    if (navegador && navegador.serial) {
      this.porta = await navegador.serial.requestPort();
      await this.porta.open({ baudRate: 4800 });

      while (this.porta.readable) {
        this.reader = this.porta.readable.getReader();
        try {
          while (true) {
            if(this.fracionado){
              const { value, done } = await this.reader.read();
              const hex = buf2hex(value)
              const ascii = hex2a(hex)
              this.formatarPeso(ascii)
            } else {
              this.reader.releaseLock();
              this.porta.close();
              return;
            }
          }
        } catch (error) {
        } finally {
          this.reader.releaseLock();

        }
      }


    } else {
      console.log("Navegador não suporta leitura serial")
    }
  }

    function buf2hex(buffer: any) { // buffer is an ArrayBuffer
      return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
    }

    function toHexString(byteArray: any) {// Byte Array -> HEX
      return Array.from(byteArray,
        function(byte: any) {
          return ('0' + (byte & 0XFF).toString(16)).slice(-2); }).join()
    }

    function hex2a(hexx: any) { // HEX-> ASCII
        var hex = hexx.toString(); //força conversão
        var str = ''
        for (var i = 0; i < hex.length; i +=  2)
          {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          }
        return str;
    }
  }


  formatarPeso(ascii:any){

    var valor = Number(ascii);
    if(!valor){
      valor = Number(ascii.substring(1));
    }
    this.quantidade = valor;
  }

  imprimir(){
    localStorage.setItem("itensVendas", JSON.stringify(this.produtos));
    var esc = '\x1B';
    var newLine = '\x0A';
    var cmds = esc + "@";
    cmds += esc + '!' + '\x38';
    cmds += 'Produtos';
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x00';
    let total = 0;
    for (let i = 0; i < this.produtos.length; i++) {
      //total = this.produtos[i].produto.preco_venda * this.produtos[i].quantidade;
      cmds += `${this.produtos[i].produto.nome}   ${this.produtos[i].quantidade}   ${this.produtos[i].produto.preco_venda}`;
      cmds += newLine;
    }
    cmds += newLine + newLine;
    cmds += `TOTAL   9.22`;
    cmds += esc + '!' + '\x00';
    cmds += newLine + newLine;
    cmds += new Date();

    //this.router.navigate(['/imprime-venda']);
    this.printService.init()
      .setSize('normal')
      .writeLine(cmds)
      .feed(4)
      .cut('full')
      .flush();
  }
}
