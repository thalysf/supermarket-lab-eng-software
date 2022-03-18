import { Tela } from './../../entity/Tela';
import { Usuario } from './../../entity/Usuario';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-usuario-tela',
  templateUrl: './usuario-tela.component.html',
  styleUrls: ['./usuario-tela.component.css']
})
export class UsuarioTelaComponent implements OnInit {

  cpf: string = "";
  nome: string = "";
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

  tela: Tela = this.telas[0];

  displayedColumns: string[] = ['nome', 'cpf', 'telas', 'acao'];

  usuarios: Usuario[] = [
    {
      nome:"JAO",
      cpf:"1999",
      acessos: [ { id: 0, nome: 'gerenciamento-usuario'}, { id: 1, nome: 'CAFÉ'} ]
    }
  ];

  dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor() { }

  ngOnInit(): void {
  }


  excluir(){

  }

  carregar(usuario:any){
    
  }

  nomesTelasPorUsuario(usuario: any){
    console.log(usuario);
    var telas = "| ";
    for(let tela of usuario.acessos){
      telas += tela.nome + " | ";
    }
    return telas;
  }
}
