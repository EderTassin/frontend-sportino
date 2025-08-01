import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';


@Component({
  selector: 'app-delegados',
  templateUrl: './delegados.component.html',
  styleUrls: ['./delegados.component.scss']
})
export class DelegadosComponent {

  @ViewChild('modalDelete') modalDelete!: ElementRef;
  @ViewChild('modalPassword') modalPassword!: ElementRef;
  
  delegados: any[] = [];
  originalDelegados: any[] = [];
  delegadoDelete: any;
  delegadoPassword: any = {};
  passwordFieldType: string = 'password';
  filter: string = '';
  showModal: boolean = false;
  showPasswordModal: boolean = false;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.loadDelegados();
    this.modalDelete?.nativeElement.classList.add('block');
    this.modalPassword?.nativeElement.classList.add('block');
  }

  async loadDelegados() {
    const delegados = await this.adminService.getDelegados() as any[];
    delegados.sort((a: any, b: any) => b.id - a.id);
    this.originalDelegados  = delegados.filter((d: any) => d.team != null);
    this.delegados = this.originalDelegados;
  }

  handleEdit(delegado: any) {
  }

  applyFilter() {
    if(this.filter.length > 0){
      this.delegados = this.originalDelegados.filter((delegado) =>
        delegado.username.toLowerCase().includes(this.filter.toLowerCase())
      );
    }else{
      this.delegados = this.originalDelegados;
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  handleDelete(delegado: any) {
    this.openModal();
    this.delegadoDelete = delegado;
  }

  handleActive(delegado: any) {
    this.adminService.updateDelegado(delegado.id).subscribe((res) => {
      delegado.confirmed = !delegado.confirmed;
    });
  }

  onConfirm() {
    const delegado = this.delegadoDelete;
    try {
      this.adminService.deleteDelegado(delegado.id).subscribe((res) => {
        this.delegados = this.originalDelegados.filter((d) => d.id !== delegado.id);
      });
    } catch (error) {
      console.log(error);
    }
  }

  toggleDelegados(active: boolean) {
    this.adminService.toggleDelegados(active).subscribe((res) => {
      if (active) {
        this.delegados = this.originalDelegados.map(d => ({ ...d, confirmed: true }));
      } else {
        this.delegados = this.originalDelegados.map(d => ({ ...d, confirmed: false }));
      }

      this.loadDelegados();
    });
  }

  handlePassword(delegado: any) {
    this.delegadoPassword = delegado;
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  onConfirmPasswordReset() {
    try {
    this.adminService.updateDelegadoPassword(this.delegadoPassword.id, this.delegadoPassword).subscribe((res) => { 
      this.closePasswordModal();
    });
  } catch (error) {
    console.log(error);
  }
}

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
