import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BannerPrincipalComponent } from './home/banner-principal/banner-principal.component';
import { MenuTelasComponent } from './home/menu-telas/menu-telas.component';
import { PrincipalComponent } from './home/principal/principal.component';
import { UsuarioTelaComponent } from './components/usuario-tela/usuario-tela.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown'
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { BiometriaDialogComponent } from './components/biometria-dialog/biometria-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerPrincipalComponent,
    MenuTelasComponent,
    PrincipalComponent,
    UsuarioTelaComponent,
    BiometriaDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }