import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem("usuario");
    this.formulario = this.formBuilder.group({
      cpf: ['', [Validators.required]]
    });
  }

  verificarUsuario() {
    if(!this.formulario.get('cpf')?.value){
      this.toastr.error('Preencha o CPF!')
    }
    else{
      this.loginService.carregarUsuario(this.formulario.get('cpf')?.value).subscribe(
        data => this.entrou(data),
        error => this.toastr.error('Usuário não cadastrado!')
      );
    }
  }

  entrou(usuario: any) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    this.router.navigate(['/home']);
  }

}
