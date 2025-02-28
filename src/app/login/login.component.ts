import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.validatePassword]]
    });
  }

  validatePassword(control: any) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return strongPasswordRegex.test(control.value) ? null : { invalidPassword: true };
  }

  async login() {
    if (this.loginForm) {
      const auth = await this.authService.login(this.email, this.password)
      const decodedToken = this.authService.decodeToken();
      if (auth) {
        if(decodedToken.admin){
          this.router.navigate(['/admin']);
        }else{
          this.router.navigate(['/manager/'+decodedToken.team_id]);
        }
      } else {
        alert('Login failed');
      }
    } else {
      console.log('CREDENCIALES INCORRECTAS');
    }
  }
}
