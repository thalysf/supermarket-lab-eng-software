import {Venda} from './../../entity/Venda';
import {BalancaService} from './../../services/balanca.service';
import {Router} from '@angular/router';
import {ItemVenda} from './../../entity/ItemVenda';
import {VendaService} from './../../services/venda.service';
import {ToastrService} from 'ngx-toastr';
import {EntradaEstoqueService} from './../../services/entrada-estoque.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Component, OnInit, ViewChild} from '@angular/core';
import {PrintService, UsbDriver} from "ng-thermal-print";
import {CafeteriaService} from 'src/app/services/cafeteria.service';
import {CartaoCliente} from 'src/app/entity/CartaoCliente';
import {FormControl} from '@angular/forms';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {CartaoClienteService} from "../../services/cartao-cliente.service";

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.css']
})
export class VendaComponent implements OnInit {

  produtos: ItemVenda[] = [];
  produtoAtual: any;
  venda: Venda = {cpf: '', nome: '', data: new Date(), cartoes: [], produtos_supermercado: []};

  codigo: any;
  quantidade: any = 1;
  precoUnitario: any;
  total: any = 0;
  imagem: any;
  precoTotalProduto: any;
  fracionado: boolean = false;
  cartoes: CartaoCliente[] = []
  cartoesSelecionados: CartaoCliente[] = []
  dropdownSettings: IDropdownSettings = {};
  cartao: CartaoCliente = {rfid: '', cpf: '', nome: '', cartao_pago: false, produtos_cafeteria: []};
  rfid: any;
  produtosRecibo: any;

  public formControlCartoes = new FormControl([]);

  displayedColumns: string[] = ["nome", "quantidade", "precoUnidade", "precoTotalProduto", "imagem", "acao"];
  dataSource = new MatTableDataSource<ItemVenda>(this.produtos);

  usbPrintDriver: UsbDriver;
  status: boolean = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  constructor(public entradaEstoqueService: EntradaEstoqueService, public cafeteriaService: CafeteriaService, private toastr: ToastrService,
              private vendaSerive: VendaService, private router: Router, private printService: PrintService,
              private balancaService: BalancaService, private cartaoClienteService: CartaoClienteService) {
    this.veririficarUsuario("VENDA");

    this.usbPrintDriver = new UsbDriver();
    this.printService.isConnected.subscribe(result => {
      this.status = result;
      if (result) {
        toastr.success('Impressora conectada!!!');
      } else {
        toastr.warning('Impressora não conectada.');
      }
    });
    this.dropdownSettings = {
      idField: 'rfid',
      textField: 'nome',
      selectAllText: 'Selecionar todos',
      allowSearchFilter: true
    };

    this.carregarCartoesCliente();
  }

  ngOnInit(): void {
  }

  requestUsb() {
    this.usbPrintDriver.requestUsb().subscribe(result => {
      this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
    });
}



 imprimir(produtosRecibo: ItemVenda[]): void {
   if(!this.status){
     this.toastr.error("Impressora não conectada!");
   }
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

  bucarCartaoClientePorRfid() {
    this.cartaoClienteService.buscarCartaoClientePorRfid(this.rfid).subscribe(
      data => {
        this.cartao = data;
        this.cartoesSelecionados.push(this.cartao);
        this.toastr.success('Cartão Cliente encontrado!');
        this.cartao.produtos_cafeteria.forEach(p => {
          this.produtos.push(p);
        })
        this.dataSource.data = this.produtos;
      },
      error => this.toastr.error('Rfid não encontrado!')
    );
  }

  inserir() {
    if (this.produtoAtual != null) {
      for (let produto of this.produtos) {
        if (produto.produto.codigo_barras === this.codigo) {
          produto.quantidade += this.quantidade;
          this.limpar();
          return;
        }
      }

      let novoItemVenda: ItemVenda = {
        quantidade: this.quantidade,
        produto: this.produtoAtual
      }

      this.produtos.push(novoItemVenda);
      this.dataSource.data = this.produtos;

      this.total += this.precoTotalProduto;

      this.limpar();
    }
  }

  limpar() {
    this.produtoAtual = null;
    this.codigo = "";
    this.quantidade = 1;
    this.precoUnitario = 0;
    this.precoTotalProduto = 0;
  }

  finalizarCompra() {
    this.prepararVenda();
    
    this.vendaSerive.realizarVenda(this.venda).subscribe(
      data => {
        this.vendaSucesso();
        this.imprimir(this.produtosRecibo);
      },
      error => this.toastr.error('Não foi possível realizar a venda: ' + error.error.ERRORS)
    )
  }

  prepararVenda() {
    this.produtosRecibo = this.produtos;
    this.produtos = this.produtos.filter(p => p.produto.setor === 'SUPERMERCADO');
    this.venda.cartoes = this.cartoesSelecionados;
    this.venda.cpf = this.venda.cartoes[0].cpf;
    this.venda.nome = this.venda.cartoes[0].nome;
    this.venda.cartoes.forEach(c => c.cartao_pago = true)
    this.venda.produtos_supermercado = this.produtos;
    this.venda.data = new Date();
  }

  vendaSucesso() {
    this.toastr.success('Venda realizada com sucesso!');
    this.limpar();
  }


  incluirProduto() {
    var texto = this.codigo;
    this.entradaEstoqueService.carregarProduto(texto).subscribe(
      data => {
        this.carregarProduto(data);
        this.inserir();
      },
      error => this.toastr.error('Não foi possível encontrar o Produto' + error.error.ERRORS)
    )

  }

  carregarProduto(produto: any) {
    this.imagem = produto.imagem;
    this.precoUnitario = produto.preco_venda;
    this.produtoAtual = produto;
    this.fracionado = produto.fracionado
    if (this.quantidade) {
      this.precoTotalProduto = this.quantidade * this.precoUnitario;
    }

    this.readerBalanca();
  }

  carregarCartoesCliente() {
    this.cafeteriaService.carregarCartaoClientes().subscribe((cartoes: CartaoCliente[]) => this.cartoes = cartoes);
  }


  excluir(produto: any) {
    for (var i = 0; i < this.produtos.length; i++) {
      if (this.produtos[i].produto.codigo_barras == produto.produto.codigo_barras) {
        this.total -= this.produtos[i].quantidade * (this.produtos[i].produto.preco_venda || 1);
        this.produtos.splice(i, 1);
        this.dataSource.data = this.produtos;
      }
    }
  }

  expandeImagem(id: any) {
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

  calcularPrecoTotalProduto() {
    this.precoTotalProduto = this.quantidade * this.precoUnitario;
  }


  async readerBalanca(): Promise<any> {
    if (this.fracionado) {
      let navegador: any;

      navegador = window.navigator;

      if (navegador && navegador.serial) {

        await this.balancaService.inicializarPorta();

        if (!this.balancaService.getPorta()) {
          this.balancaService.porta = await navegador.serial.requestPort();
          await this.balancaService.porta.open({baudRate: 4800});
        }

        try {
          await this.balancaService.porta.open({baudRate: 4800});
        } catch (err) {

        }
        while (this.balancaService.porta.readable) {
          try {
            this.balancaService.reader = this.balancaService.porta.readable.getReader();
          } catch (err) {

          }
          try {
            while (true) {
              if (this.fracionado) {
                const {value, done} = await this.balancaService.reader.read();
                const hex = buf2hex(value)
                const ascii = hex2a(hex)
                this.formatarPeso(ascii)
              } else {
                this.balancaService.reader.releaseLock();
                this.balancaService.porta.close();
                return;
              }
            }
          } catch (error) {
          } finally {
            this.balancaService.reader.releaseLock();

          }
        }


      } else {
        this.toastr.error("Navegador não suporta leitura serial");
      }
    }

    function buf2hex(buffer: any) { // buffer is an ArrayBuffer
      return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
    }

    function toHexString(byteArray: any) {// Byte Array -> HEX
      return Array.from(byteArray,
        function (byte: any) {
          return ('0' + (byte & 0XFF).toString(16)).slice(-2);
        }).join()
    }

    function hex2a(hexx: any) { // HEX-> ASCII
      var hex = hexx.toString(); //força conversão
      var str = ''
      for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    }
  }


  formatarPeso(ascii: any) {

    var valor = Number(ascii);
    if (!valor) {
      valor = Number(ascii.substring(1));
    }
    this.quantidade = valor;
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
}
