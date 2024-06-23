import {  Component, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})

export class RegisterComponent {

    
    registerForm: FormGroup;
    
    constructor(private fb: FormBuilder, private router: Router) {
        this.registerForm = this.fb.group({
            delegateName: ['', Validators.required],
            documentNumber: ['', Validators.required],
            securityKey: ['', [Validators.required, Validators.maxLength(10)]],
            email: ['', [Validators.required, Validators.email]],
            category: ['', Validators.required]
        });
    }
    
    ngOnInit(){ }
    
    register(): void {
        if (this.registerForm.valid) {
            console.log(this.registerForm.value);
            this.router.navigate(['/home-admin']);
        }
    }
}
