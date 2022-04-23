import { Produto } from './../../entity/Produto';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CadastroProdutoService } from 'src/app/services/cadastro-produto.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from "@angular/router";



@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css']
})
export class CadastroProdutoComponent implements AfterViewInit {

  setores = ['CAFETERIA', 'SUPERMERCADO']
  nome: string = "";
  precoVenda: number = 0;
  precoCompra: number = 0;
  imagem: any;
  codigoBarras: string = "";
  fracionado = false;
  qtdEstoque: number = 0;
  setor: string = "";
  rfid: string = "";
  produtos: Produto[] = [];

  fileSelected?: Blob;
  imageUrl?: string;

  displayedColumns: string[] = ['nome', 'preco_compra', 'preco_venda', 'codigo_barras', 'RFID', 'quantidade', 'fracionado', 'setor', 'imagem', 'acao'];

  dataSource = new MatTableDataSource<Produto>(this.produtos);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public cadastroProdutoService: CadastroProdutoService,
    private toastr: ToastrService, private sant: DomSanitizer, private router: Router) {
    this.veririficarUsuario('PRODUTO');
    this.carregarProduto();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
  }

  async cadastrar() {
    const produto: Produto = {
      nome: this.nome,
      preco_venda: this.precoVenda,
      preco_compra: this.precoCompra,
      imagem: this.imagem,
      fracionado: this.fracionado,
      codigo_barras: this.codigoBarras,
      qtd_estoque: this.qtdEstoque,
      setor: this.setor,
      rfid: this.rfid,
    }

    this.cadastroProdutoService.cadastrarProduto(produto).subscribe(
      data => this.carregarProduto(),
      error => this.toastr.error('Não foi possível Cadastrar o Produto')
    );
  }



  atualizar() {
    const produto: Produto = {
      nome: this.nome,
      preco_venda: this.precoVenda,
      preco_compra: this.precoCompra,
      imagem: this.imagem,
      fracionado: this.fracionado,
      codigo_barras: this.codigoBarras,
      qtd_estoque: this.qtdEstoque,
      setor: this.setor,
      rfid: this.rfid,
    }
    this.cadastroProdutoService.atualizarProduto(produto).subscribe(
      data => this.carregarProduto(),
      error => this.toastr.error('Não foi possível Atualizar o Produto')
    )

  }

  deletar(produto: any) {
    this.cadastroProdutoService.deletarProduto(produto.rfid).subscribe(
      data => this.carregarProduto(),
      error => this.toastr.error('Não foi possível Excluir o Produto')
    )
  }

  limpar() {
    this.nome = "";
    this.precoVenda = 0;
    this.precoCompra = 0;
    this.imagem = [];
    this.fracionado = false;
    this.codigoBarras = "";
    this.qtdEstoque = 0;
    this.setor = "";
    this.rfid = "";
    this.imagem = null;
    this.fileSelected = new Blob();
    this.imageUrl = "";
  }

  carregarProduto() {
    this.cadastroProdutoService.carregarProduto().subscribe((produto: Produto[]) =>
      this.carregarListaProdutos(produto)
    )
  }

  carregarListaProdutos(produtos: Produto[]): void {
    this.produtos = produtos;
    this.dataSource.data = this.produtos;
  }

  produtoFunc(produto: Produto[]): Produto[] {
    return produto
  }

  onSelectNewImage(event: any) {
    const target = event.target as HTMLInputElement;
    this.fileSelected = target!.files![0];
    this.imageUrl = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileSelected)) as string

    this.convertFileToBase64();
  }

  convertFileToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.fileSelected as Blob);
    reader.onloadend = () => {
      this.imagem = reader.result as string;
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


  veririficarUsuario(tela: string) {
    if (localStorage.getItem('usuario')) {
      let usuario = JSON.parse(localStorage.getItem('usuario') || '');
      for (let i = 0; i < usuario.telas.length; i++) {
        if (usuario.telas[i].nome === tela) {
          return;
        }
      }
      return this.router.navigate(['/home']);
    }

    return this.router.navigate(['/login']);

  }

  async readerRfid(): Promise<any> {
    console.log("iniciando leitura")
    let navegador: any;

    navegador = window.navigator;

    if (navegador && navegador.serial) {
      const porta = await navegador.serial.requestPort();

      await porta.open({ baudRate: 57600 });
      console.log(porta)

      while (porta.readable) {
        const reader = porta.readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              // |reader| has been canceled.
              break;
            }
            console.log("value: ")
            console.log(value)
            const hex = buf2hex(value)
            console.log("hex: ")
            console.log(hex)
            // // const ascii = hex2a(hex)
            // // console.log("ascii: ")
            // // console.log(ascii)
          }
        } catch (error) {
          // Handle |error|...
        } finally {
          reader.releaseLock();
        }
      }


    } else {
      console.log("Navegador não suporta leitura serial")
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
        for (var i = 0; i < hex.length; i +-  2) 
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); 
        return str;
    }
  }
}
