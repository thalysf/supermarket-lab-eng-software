import { RfidService } from './../../services/rfid.service';
import {Venda} from './../../entity/Venda';
import {BalancaService} from './../../services/balanca.service';
import {Router} from '@angular/router';
import {ItemVenda} from './../../entity/ItemVenda';
import {VendaService} from './../../services/venda.service';
import {ToastrService} from 'ngx-toastr';
import {EntradaEstoqueService} from './../../services/entrada-estoque.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PrintService, UsbDriver} from "ng-thermal-print";
import {CafeteriaService} from 'src/app/services/cafeteria.service';
import {CartaoCliente} from 'src/app/entity/CartaoCliente';
import {FormControl} from '@angular/forms';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {CartaoClienteService} from "../../services/cartao-cliente.service";
import {ImpressoraTermicaService} from "../../services/impressora-termica.service";

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.css']
})
export class VendaComponent implements OnInit, OnDestroy {

  produtos: ItemVenda[] = [];
  produtoAtual: any;
  venda: Venda = {cpf: '', nome: '', data: new Date(), cartoes: [], produtos_supermercado: []};

  codigo: any;
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
  produtoPesquisado:boolean = false;

  mudandoTela:boolean = false;
  navegador:any;

  public formControlCartoes = new FormControl([]);

  displayedColumns: string[] = ["nome", "quantidade", "precoUnidade", "precoTotalProduto", "imagem", "acao"];
  dataSource = new MatTableDataSource<ItemVenda>(this.produtos);

  status: boolean = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  @ViewChild("myNameElem") myNameElem: any;

  constructor(public entradaEstoqueService: EntradaEstoqueService, public cafeteriaService: CafeteriaService, private toastr: ToastrService,
              private vendaSerive: VendaService, private router: Router, public impressoraTermicaService: ImpressoraTermicaService,
              public balancaService: BalancaService, private cartaoClienteService: CartaoClienteService,
              public rfidService:RfidService) {
    this.verificarUsuario("VENDA");
    this.impressoraTermicaService.getLocalStorageImpressora();
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

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.focusPrimeiroElementoFormulario();
  }

  atualizarDataSource(): void {
    this.dataSource.data = this.produtos;
  }

  bucarCartaoClientePorRfid() {
    this.cartaoClienteService.buscarCartaoClientePorRfid(this.rfidService.rfid).subscribe(
      data => {
        this.cartao = data;
        if(this.cartao.produtos_cafeteria.length === 0) {
          this.toastr.warning("Cart??o informado sem produtos da cafeteria");
          return;
        }
        this.cartao.produtos_cafeteria.forEach(c => {

          let index = this.produtos.findIndex(p => p.produto.rfid === c.produto.rfid);
          if(index === -1) {
            this.produtos.push(c);
          } else {
            this.produtos[index].quantidade += c.quantidade;
          }
        });
        this.cartoesSelecionados.push(this.cartao);
        this.toastr.success('Cart??o Cliente encontrado!');
        this.atualizarTotalGeral();
        this.atualizarDataSource();
      },
      error => this.toastr.error('Rfid n??o encontrado!')
    );
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  inserir() {
    if (this.produtoAtual != null) {

      if(!this.produtoAtual.fracionado && (this.balancaService.peso%1)!==0){
        this.toastr.error('O Produto n??o ?? fracionado!')
        return;
      }

      for (let produto of this.produtos) {
        if (produto.produto.codigo_barras === this.codigo) {
          produto.quantidade = Number(produto.quantidade) + Number(this.balancaService.peso);
          return;
        }
      }

      let novoItemVenda: ItemVenda = {
        quantidade: this.balancaService.peso,
        produto: this.produtoAtual
      }

      this.produtos.push(novoItemVenda);
      this.dataSource.data = this.produtos;

      this.focusPrimeiroElementoFormulario();
    }
  }

  limpar() {
    this.produtoAtual = null;
    this.codigo = "";
    this.balancaService.peso = 1;
    this.precoUnitario = 0;
    this.precoTotalProduto = 0;
  }

  limparTabela(){
    this.dataSource.data = [];
  }

  conectarUsb(): void {
    this.impressoraTermicaService.requestUsb().then(() => console.log("Conectado"));
  }

  finalizarCompra() {
    if(this.cartao.rfid === undefined || this.cartao.rfid === null || this.cartao.rfid === ''){
      this.toastr.error("Cart??o n??o carregado ou vazio");
      return;
    }

    this.prepararVenda();

     this.vendaSerive.realizarVenda(this.venda).subscribe(
       data => {
         this.vendaSucesso();
         this.impressoraTermicaService.imprimir(this.produtosRecibo);
       },
       error => this.toastr.error('N??o foi poss??vel realizar a venda: ' + error.error.ERRORS)
     )
     this.limpar();
     this.focusPrimeiroElementoFormulario();
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
    this.total = 0;
    this.limparTabela();
  }

  incluirPesquisarProduto(){
    var texto = this.codigo;
    if(!this.produtoPesquisado){
      this.entradaEstoqueService.carregarProduto(texto).subscribe(
        data => {
          this.carregarProduto(data);
          this.produtoPesquisado = true;
        },
        error => this.toastr.error('N??o foi poss??vel encontrar o Produto' + error.error.ERRORS)
      )
    } else {
      this.incluirProduto();
    }
  }

  incluirProduto() {
    var texto = this.codigo;
    this.entradaEstoqueService.carregarProduto(texto).subscribe(
      data => {
        this.carregarProduto(data);
        this.inserir();
        this.atualizarTotalGeral();
        this.produtoPesquisado = false;
      },
      error => this.toastr.error('N??o foi poss??vel encontrar o Produto' + error.error.ERRORS)
    )
    this.focusPrimeiroElementoFormulario();
  }

  carregarProduto(produto: any) {
    this.imagem = produto.imagem;
    this.precoUnitario = produto.preco_venda;
    this.produtoAtual = produto;
    this.fracionado = produto.fracionado
    if (this.balancaService.peso) {
      this.precoTotalProduto = this.balancaService.peso * this.precoUnitario;
    }
  }

  carregarCartoesCliente() {
    this.cafeteriaService.carregarCartaoClientes().subscribe((cartoes: CartaoCliente[]) => this.cartoes = cartoes);
  }


  excluir(produto: any) {
    for (var i = 0; i < this.produtos.length; i++) {
      if (this.produtos[i].produto.codigo_barras == produto.produto.codigo_barras) {
        this.total -= this.produtos[i].quantidade * (this.produtos[i].produto.preco_venda || 1);
        this.produtos.splice(i, 1);
        this.atualizarDataSource();
      }
    }
    this.atualizarTotalGeral();
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
    this.precoTotalProduto = this.balancaService.peso * this.precoUnitario;
  }

  focusPrimeiroElementoFormulario(): void {
    let blurElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
    blurElement.blur();

    setTimeout(function () {
      let focusElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
      focusElement.focus();
    }, 0);
  }

  verificarUsuario(tela: string) {
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

  atualizarTotalGeral(): void {
    this.total = 0;
    this.produtos.forEach( p => {
      this.total += p.quantidade * (p.produto.preco_venda || 0);
    });
  }
}
