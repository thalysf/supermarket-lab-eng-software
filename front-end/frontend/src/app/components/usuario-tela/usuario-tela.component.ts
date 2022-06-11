import {UsuarioTelaService} from './../../services/usuario-tela.service';
import {Tela} from './../../entity/Tela';
import {Usuario} from './../../entity/Usuario';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Router} from "@angular/router";

@Component({
  selector: 'app-usuario-tela',
  templateUrl: './usuario-tela.component.html',
  styleUrls: ['./usuario-tela.component.css']
})
export class UsuarioTelaComponent implements AfterViewInit {

  cpf: string = "";
  nome: string = "";
  telasSelecionadas: Tela[] = [];
  telas: Tela[] = [{
    idTela: 1,
    nome: 'aa'
  }]

  public controlTelas = new FormControl([]);
  dropdownSettings: IDropdownSettings = {};
  displayedColumns: string[] = ['nome', 'cpf', 'telas', 'acao'];

  usuarios: Usuario[] = [];

  dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public usuarioTelaService: UsuarioTelaService, private toastr: ToastrService, private router: Router) {
    this.veririficarUsuario('USUARIO');

    this.dropdownSettings = {
      idField: 'id_tela',
      textField: 'nome'
    };

    this.carregarTelas();
    this.carregarUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.focusPrimeiroElementoFormulario();
  }

  inserir() {
    if(this.nome && this.cpf && this.telas.length > 0) {
      const usuario: Usuario = {
        cpf: this.cpf,
        nome: this.nome,
        telas: this.telasSelecionadas,
        biometria: null
      }

      this.usuarioTelaService.criarUsuario(usuario).subscribe(
        data => {
          this.carregarUsuarios()
          this.toastr.success('Usuário criado com sucesso');
        },
        error => this.toastr.error('Não foi possível Inserir o Usuário. Verifique se o CPF já existe')
      );

      this.carregarUsuarios();

    } else {
      if(!this.nome) {
        this.toastr.warning('Informe um nome');
      }

      if(!this.cpf) {
        this.toastr.warning('Cpf inválido');
      }

      if(this.telasSelecionadas.length === 0) {
        this.toastr.warning('Selecione uma tela');
      }
    }
    this.limpar();
    this.focusPrimeiroElementoFormulario();
  }

  editar() {
    if(this.nome && this.cpf && this.telas.length > 0) {
      const usuario: Usuario = {
        cpf: this.cpf,
        nome: this.nome,
        telas: this.telasSelecionadas,
        biometria: null
      }

      this.usuarioTelaService.atualizarUsuario(usuario).subscribe(
        data => {
          this.carregarUsuarios();
          this.toastr.success('Usuário atualizado com sucesso');
        },
        error => this.toastr.error('Não foi possível editar o Usuário')
      );

      this.carregarUsuarios();

    } else {
      if(!this.nome) {
        this.toastr.warning('Informe um nome');
      }

      if(!this.cpf) {
        this.toastr.warning('Cpf inválido');
      }

      if(this.telasSelecionadas.length === 0) {
        this.toastr.warning('Selecione uma tela');
      }
    }
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

  excluir(usuario: any) {
    this.usuarioTelaService.excluirUsuario(usuario).subscribe(
      data => {
        this.carregarUsuarios();
        this.toastr.success('Usuário excluído');
      },
      error => this.toastr.error('Não foi possível excluir o Usuário')
    );
  }

  limpar() {
    this.cpf = "";
    this.nome = "";
    this.telasSelecionadas = [];
  }

  carregarTelas() {
    this.usuarioTelaService.carregarTelas().subscribe(
      data => this.telas = data,
      error => this.toastr.error('Não foi possível carregar as telas')
    );
  }

  carregarUsuarios() {
    this.usuarioTelaService.carregarUsuarios().subscribe((usuarios: Usuario[]) =>
      this.dataSource.data = this.usuariosFunc(usuarios)
    )
  }

  usuariosFunc(usuarios: Usuario[]): Usuario[] {
    return usuarios
  }

  carregar(usuario: any) {

    this.cpf = usuario.cpf;
    this.nome = usuario.nome;
    this.telasSelecionadas = usuario.telas;
  }

  nomesTelasPorUsuario(usuario: any) {
    var telas = "";
    for (let tela of usuario.telas) {
      telas += tela.nome + " | ";
    }
    return telas;
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
