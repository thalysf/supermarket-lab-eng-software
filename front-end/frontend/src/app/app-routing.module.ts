import { VendaComponent } from './components/venda/venda.component';
import { EntradaEstoqueComponent } from './components/entrada-estoque/entrada-estoque.component';
import { CadastroProdutoComponent } from './components/cadastro-produto/cadastro-produto.component';
import { UsuarioTelaComponent } from './components/usuario-tela/usuario-tela.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login/login.component";
import {HomeComponent} from "./components/home/home/home.component";
import { CafeteriaComponent } from './components/cafeteria/cafeteria.component';
import {ImprimeVendaComponent} from "./components/imprime-venda/imprime-venda/imprime-venda.component";

const routes: Routes = [
  {
    path: "usuario-tela",
    component: UsuarioTelaComponent
  },
  {
    path: "cadastro-produto",
    component: CadastroProdutoComponent
  },
  {
    path: "entrada-estoque",
    component: EntradaEstoqueComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'venda',
    component: VendaComponent
  },
  {
    path: 'cateferia',
    component: CafeteriaComponent
  },
  {
    path: 'imprime-venda',
    component: ImprimeVendaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
