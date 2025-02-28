import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '../_services/auth.interceptor';
import { UserGuard } from '../_services/auth-guard.service';
import { ManagerComponent } from './manager/manager.component';
import { MatMenuModule } from '@angular/material/menu';
const routes: Routes = [
    //{ path: '', component: ManagerComponent, canActivate: [UserGuard] },
    { path: ':id', component: ManagerComponent, canActivate: [UserGuard]},
  ];
  
  @NgModule({
    declarations: [
        ManagerComponent,
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forChild(routes),
      MatMenuModule
      
    ],
    exports: [RouterModule]
  })
  
  
export class ManagerModule { }
