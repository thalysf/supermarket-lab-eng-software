import { UsuarioTelaService } from './../../services/usuario-tela.service';
import { BiometriaDialogComponent } from './../biometria-dialog/biometria-dialog.component';
import { Tela } from './../../entity/Tela';
import { Usuario } from './../../entity/Usuario';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConditionalExpr } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-tela',
  templateUrl: './usuario-tela.component.html',
  styleUrls: ['./usuario-tela.component.css']
})
export class UsuarioTelaComponent implements AfterViewInit  {

  cpf: string = "";
  nome: string = "";
  telasSelecionadas:Tela[] = [];
  telas:Tela[] = [{
    idTela: 1,
    nome: 'aa'
  }]

  public controlTelas = new FormControl([]);
  dropdownSettings:IDropdownSettings={};
  displayedColumns: string[] = ['nome', 'cpf', 'telas', 'acao'];

  usuarios: Usuario[] = [];

  dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public usuarioTelaService:UsuarioTelaService, private toastr:ToastrService) { 

    this.dropdownSettings = {
      idField: 'id_tela',
      textField: 'nome'
    };

    this.carregarTelas();
    this.carregarUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  inserir(){

    const usuario: Usuario = {
      cpf : this.cpf,
      nome: this.nome,
      telas:this.telasSelecionadas,
      biometria:null
    }

    this.usuarioTelaService.criarUsuario(usuario).subscribe(
      data=> this.carregarUsuarios(),
      error=>this.toastr.error('Não foi possível Inserir o Usuário')
    );

    this.carregarUsuarios();

    // Biometria
    //const dialogRef = this.dialog.open(BiometriaDialogComponent);
    //dialogRef.afterClosed().subscribe(result => {
    //  console.log(`Dialog result: ${result}`);
    //});
  }

  editar(){

    const usuario: Usuario = {
      cpf : this.cpf,
      nome: this.nome,
      telas:this.telasSelecionadas,
      biometria:null
    }

    this.usuarioTelaService.atualizarUsuario(usuario).subscribe(
      data=> this.carregarUsuarios(),
      error=>this.toastr.error('Não foi possível editar o Usuário')
    );
  }

  excluir(usuario:any){
    this.usuarioTelaService.excluirUsuario(usuario).subscribe(
      data=> this.carregarUsuarios(),
      error=>this.toastr.error('Não foi possível excluir o Usuário')
    );
  }

  limpar(){
    this.cpf = "";
    this.nome = "";
    this.telasSelecionadas = [];
  }

  carregarTelas(){
    this.usuarioTelaService.carregarTelas().subscribe(
      data=> this.telas = data,
      error=>this.toastr.error('Não foi possível carregar as telas')
    );
  }

  carregarUsuarios(){
    this.usuarioTelaService.carregarUsuarios().subscribe((usuarios:Usuario[])=>
      this.dataSource.data = this.usuariosFunc(usuarios)
    )
  }

  usuariosFunc(usuarios:Usuario[]):Usuario[]{
    console.log(usuarios);
    return usuarios
  }

  carregar(usuario:any){
    
    this.cpf = usuario.cpf;
    this.nome = usuario.nome;
    this.telasSelecionadas = usuario.telas;
  }

  nomesTelasPorUsuario(usuario: any){
    var telas = "";
    for(let tela of usuario.telas){
      telas += tela.nome + " | ";
    }
    return telas;
  }
}