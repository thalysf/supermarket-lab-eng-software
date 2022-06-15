import { BalancaService } from './../../services/balanca.service';
import { RfidService } from './../../services/rfid.service';
import { CafeteriaService } from './../../services/cafeteria.service';
import { ItemVenda } from './../../entity/ItemVenda';
import { CartaoCliente } from './../../entity/CartaoCliente';
import { Produto } from './../../entity/Produto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CadastroProdutoService } from 'src/app/services/cadastro-produto.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from "@angular/router";
import {CartaoClienteService} from "../../services/cartao-cliente.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-cafeteria',
  templateUrl: './cafeteria.component.html',
  styleUrls: ['./cafeteria.component.css']
})
export class CafeteriaComponent implements OnInit {
  setor: string = "CAFETERIA";
  produtos: Produto[] = [];
  cartoes: CartaoCliente[] = [];
  produtoSelecionado: any;
  cartaoSelecionado: any = {};
  rfidSelecionado: boolean = false;
  rfid = "";

  porta: any;
  reader: any;
  navegador:any;

  mudandoTela:boolean = false;

  formulario: FormGroup = this.formBuilder.group({});

  // displayedColumns: string[] = ['nome', 'rfid', 'cpf', 'cartao_pago', 'produtos', 'acao'];
  displayedColumns: string[] = ['nome', 'preco_venda', 'qtd', 'acao'];

  dataSource = new MatTableDataSource<ItemVenda>(this.cartaoSelecionado.produtos_cafeteria);
  // dataSource = new MatTableDataSource<CartaoCliente>(this.cartoes);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public cafeteriaService: CafeteriaService,
    public cadastroProdutoService: CadastroProdutoService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private sant: DomSanitizer, private router: Router, private cartaoClienteService: CartaoClienteService,
    public rfidService:RfidService, public balancaService:BalancaService ) {
    this.veririficarUsuario('CAFETERIA');
    
    // this.carregarProduto();
    // this.carregarCartaoCliente();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.focusPrimeiroElementoFormulario();
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      rfid: ['', [Validators.required]],
      codigoBarras: ['', [Validators.required]],
      quantidade: [1, [Validators.required]]
    });
  }

  bucarCartaoClientePorRfid() {
    this.cartaoClienteService.buscarCartaoClientePorRfid(this.formulario.get('rfid')?.value).subscribe(
      data => {
        this.cartaoSelecionado = data;
        this.rfidSelecionado = true;
        this.toastr.success('Cartão Cliente encontrado!');
      },
      error => this.toastr.error('Rfid não encontrado!')
    );
  }

  bucarProdutoPorCodigoDeBarras() {
    this.cadastroProdutoService.buscarProdutoPorCodigoDeBarras(this.formulario.get('codigoBarras')?.value).subscribe(
      data => {
        this.produtoSelecionado = data;
        this.addCarrinho(this.produtoSelecionado, this.formulario.get('quantidade')?.value);
        this.toastr.success('Produto adicionado no carrinho!');
      },
      error => this.toastr.error('Produto não encontrado!')
    );
  }


  addCarrinho(produtoSelecionado: any, qtd: number): void {

    if(!produtoSelecionado.fracionado && (qtd%1)!==0){
      this.toastr.error('O Produto não é fracionado!')
      return;
    }

    let itemVenda: ItemVenda = { produto: produtoSelecionado, quantidade: qtd };

    let atualizacao: boolean = false;

    for (let item of this.cartaoSelecionado.produtos_cafeteria) {
      if (produtoSelecionado.codigo_barras === item.produto.codigo_barras) {
        const index = this.cartaoSelecionado.produtos_cafeteria.indexOf(item);
        this.cartaoSelecionado.produtos_cafeteria[index].quantidade = Number(this.cartaoSelecionado.produtos_cafeteria[index].quantidade);
        qtd = Number(qtd);
        this.cartaoSelecionado.produtos_cafeteria[index].quantidade += qtd;
        atualizacao = true;
      }
    }
    if (!atualizacao) {
      this.cartaoSelecionado.produtos_cafeteria.push(itemVenda);
      this.dataSource.data = this.cartaoSelecionado.produtos_cafeteria;
    }
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  removerCarrinho(index: any): void {
    this.cartaoSelecionado.produtos_cafeteria.splice(index, 1);
  }

  addProdutosAoCartao() {

      this.cafeteriaService.addProdutosAoCartaoCliente(this.cartaoSelecionado).subscribe(
        data => {
          this.toastr.success('Produtos adicionados ao cartão!');
        },
        error => this.toastr.error(error.error.ERRORS)
      );
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  limparProdutosCartao(cartaoCliente: CartaoCliente) {
    this.cafeteriaService.limparProdutosCartao(cartaoCliente).subscribe(
      data => {
        this.toastr.success('Produtos removidos do Cartão Cliente!');
        this.carregarProduto();
        this.carregarCartaoCliente();
      },
      error => this.toastr.error('Não foi possível Limpar os Produtos do Cartão Cliente: ' + error.error.ERRORS)
    )
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  focusPrimeiroElementoFormulario(): void{
    let blurElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
    blurElement.blur();

    setTimeout(function(){
      let focusElement: HTMLElement = document.getElementById("primeiroElementoForm") as HTMLElement;
      focusElement.focus();
    },0);
  }

  limpar() {
    this.formulario.get('rfid')?.setValue('');
    this.formulario.get('codigoBarras')?.setValue('');
    this.formulario.get('quantidade')?.setValue(1);
    this.rfidSelecionado = false;
  }

  carregarProduto() {
    this.cadastroProdutoService.carregarProdutoPorSetor(this.setor).subscribe((produto: Produto[]) =>
      this.carregarListaProdutos(produto)
    )
  }

  carregarListaProdutos(produtos: Produto[]): void {
    this.produtos = produtos;
  }


  carregarCartaoCliente() {
    this.cafeteriaService.carregarCartaoClientes().subscribe((cartoes: CartaoCliente[]) =>
      this.carregarListaCartaoCliente(cartoes)
    )
  }

  carregarListaCartaoCliente(cartoes: CartaoCliente[]): void {
    this.cartoes = cartoes;
  }


  produtoFunc(produto: Produto[]): Produto[] {
    return produto;
  }

  camposPreenchidos(): boolean {
    return this.cartaoSelecionado && this.produtoSelecionado && this.formulario.get('quantidade')?.value > 0;
  }

  clienteSelecionado(): boolean {
    return this.cartaoSelecionado.nome != '';
  }

  carrinhoPreenchido(): boolean {
    return this.cartaoSelecionado.produtos_cafeteria.length > 0;
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
