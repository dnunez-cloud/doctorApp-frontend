import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'cookie';

import { UsuarioService } from '../servicios/usuario.service';
import { CompartidoService } from '../../compartido/compartido.service';
import { Login } from '../interfaces/login';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private usuarioServicio: UsuarioService,
              private compartidoServicio: CompartidoService,
              private cookieSerice: CookieService
             ) {

    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  iniciarSesion() {
    this.mostrarLoading = true;
    const request: Login = {
      username: this.formLogin.value.username,
      password: this.formLogin.value.password
    };
    this.usuarioServicio.iniciarSesion(request).subscribe({
      next: (response) => {
        this.compartidoServicio.guardarSesion(response);
        this.cookieSerice.set(
          'Authorization',
          `Bearer ${response.token}`,
          undefined,
          '/',
          undefined,
          true,
          'Strict'
        );

        this.router.navigate(['layout']);
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: (error) => {
        this.compartidoServicio.mostrarAlerta(error.error, 'Error');
        this.mostrarLoading = false;
      }
    });
  }
}
