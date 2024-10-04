import { Component, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { ToastrService } from 'src/app/shared/service/toastr.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})

export class RegisterComponent {

    categories: any[] = [];
    registerForm: FormGroup;
    teamsFree: any[] = [];
    selectedCategory: any;
    passwordVisible: boolean = false;

    constructor(private fb: FormBuilder, private router: Router,
        private loginService: LoginService, private toastr: ToastrService) {
        this.registerForm = this.fb.group({
            full_name: ['', Validators.required],
            documentNumber: ['', Validators.required],
            password: ['', [Validators.required, Validators.maxLength(15)]],
            email: ['', [Validators.required, Validators.email]],
            team: ['', Validators.required]
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


        if (this.registerForm.valid) {

            const data = {
                full_name: this.registerForm.value.full_name,
                id_card: this.registerForm.value.documentNumber,
                password: this.registerForm.value.password,
                email: this.registerForm.value.email,
                team: this.registerForm.value.team
            }

            await this.loginService.register(data).then(() => {
                this.router.navigate(['/login']);
                this.toastr.success("Delegado registrado correctamente", "Registro exitoso! ⚽🎉");
            }).catch((error) => {
                this.toastr.error('Error al registrar el delegado', error.message);
            });
        }

        if (!this.registerForm.valid) { 
            this.toastr.error('El formulario no es valido, falta completar campos', 'Error')
        }
    }  

    togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }

    goBack(): void {
        this.router.navigate(['/login']);
    }
}
