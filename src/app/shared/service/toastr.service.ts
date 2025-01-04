import { Injectable } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  constructor(private toastr: NgxToastrService) {}

  success(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title);
  }

  error(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title);
  }

  info(message: string, title: string = 'Information'): void {
    this.toastr.info(message, title);
  }

  warning(message: string, title: string = 'Warning'): void {
    this.toastr.warning(message, title);
  }
}