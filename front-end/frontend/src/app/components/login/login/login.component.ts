import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario: FormGroup = this.formBuilder.group({});
  usuario: any;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      cpf: ['', [Validators.required]]
    });
  }

  verificarUsuario() {
    this.loginService.carregarUsuario(this.formulario.get('cpf')?.value).subscribe(
      data => this.entrou(data), error => console.log('error')
    );
  }

  entrou(usuario: any) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    this.router.navigate(['/home']);
  }

}
