import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BannerPrincipalComponent } from './home/banner-principal/banner-principal.component';
import { MenuTelasComponent } from './home/menu-telas/menu-telas.component';
import { PrincipalComponent } from './home/principal/principal.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerPrincipalComponent,
    MenuTelasComponent,
    PrincipalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
