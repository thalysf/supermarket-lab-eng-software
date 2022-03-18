import { Tela } from './../../entity/Tela';
import { Usuario } from './../../entity/Usuario';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-usuario-tela',
  templateUrl: './usuario-tela.component.html',
  styleUrls: ['./usuario-tela.component.css']
})
export class UsuarioTelaComponent implements OnInit {

  cpf: string = "";
  nome: string = "";
  telasSelecionadas:Tela[] = [];
  telas:Tela[] = [
    {
    nome:'TELA 01',
    id:0
    },
    {
      nome:'TELA 02',
      id:1
    }
  ]

  public controlTelas = new FormControl([]);
  dropdownSettings:IDropdownSettings={};
  displayedColumns: string[] = ['nome', 'cpf', 'telas', 'acao'];

  usuarios: Usuario[] = [
    {
      nome:"JAO",
      cpf:"1999",
      acessos: [ { id: 0, nome: 'TELA 01'}, { id: 1, nome: 'TELA 02'} ]
    }
  ];

  dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor() { 

    this.dropdownSettings = {
      idField: 'id',
      textField: 'nome',
    };
  }

  ngOnInit(): void {
  }


  excluir(){

  }

  carregar(usuario:any){
    
    this.cpf = usuario.cpf;
    this.nome = usuario.nome;
    this.telasSelecionadas = usuario.acessos;
  }

  nomesTelasPorUsuario(usuario: any){
    var telas = "| ";
    for(let tela of usuario.acessos){
      telas += tela.nome + " | ";
    }
    return telas;
  }
}
