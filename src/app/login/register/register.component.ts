import { Component, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { ToastrService } from 'src/app/shared/service/toastr.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  categories: any[] = [];
  registerForm: FormGroup;
  teamsFree: any[] = [];
  selectedCategory: any;
  passwordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      full_name: ["", Validators.required],
      documentNumber: ["", Validators.required],
      password: ["", [Validators.required, Validators.maxLength(15)]],
      email: ["", [Validators.required, Validators.email]],
      team: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.loadTeamsFree();
  }

  async loadTeamsFree() {
    const teams = await this.loginService.getTeamsFree();
    this.teamsFree = teams as any[];
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
  }

  async register() {
    if (!this.registerForm.valid) {
      this.toastr.error(
        "El formulario no es valido, falta completar campos",
        "Error"
      );
      return;
    }

    const data = {
      id_card: this.registerForm.value.documentNumber,
      username: this.registerForm.value.full_name,
      password: this.registerForm.value.password,
      email: this.registerForm.value.email,
      team: Number(this.registerForm.value.team),
    };

    try {
      await this.loginService.register(data);
      this.router.navigate(["/login"]);
      this.toastr.success(
        "Delegado registrado correctamente",
        "Registro exitoso! ⚽🎉"
      );
    } catch (error: any) {
      let errorMessage = 'Error desconocido';
      
      if (error.error && typeof error.error === 'object') {
        errorMessage = Object.entries(error.error)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      this.toastr.error(errorMessage, "Error al registrar el delegado");
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  goBack(): void {
    this.router.navigate(["/login"]);
  }
}
