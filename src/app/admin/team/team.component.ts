import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadisticaPartidosService } from 'src/app/home/tabla-fixture/service/estadistica-partidos.service';
import { AdminService } from '../service/admin.service';
import { Router } from '@angular/router';

interface FootballTeam {
  id: number;
  name: string;
  responsible: string;
  documents: string;
  phone: string;
  email: string;
  pictureFile: string | null;
  logo_file: string | null;
  need_to_pay: boolean;
  active: boolean;
  category: number;
  company: string | null;
  activeSanctions: boolean;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
 
  filter = '';
  teams: FootballTeam[] = []; 
  filteredTeams: FootballTeam[] = [];
  isModalOpen = false;
  defaultLogo: string = 'https://static.vecteezy.com/system/resources/previews/000/356/368/non_2x/leader-of-group-vector-icon.jpg';
  defaultTeamPhoto: string = '';
  teamForm: FormGroup;
  urlImage: string = '';
  leagues: any[] = [];
  sortColumn: keyof FootballTeam = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortedTeams: FootballTeam[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, 
      private serviceEstadistica: EstadisticaPartidosService,
      private adminService: AdminService,
      private router: Router) {
    this.teamForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      manager: ['', Validators.required],
      league: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.email]],
      teamPhoto: [''],
      logo: [''],
      isActive: [false],
      hasSanctions: [false],
      needToPay: [false]
    });
  }

  ngOnInit(): void {
    this.getTeams();
    this.getCategories();
  }

  async getTeams() {
    const result = await this.serviceEstadistica.getAllTeams();
    this.teams = result as FootballTeam[];
    this.filteredTeams = result as FootballTeam[];
    this.filteredTeams.sort((a: any, b: any) => b.id - a.id);
  }

  sort(column: keyof FootballTeam): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  applySort(): void {
    this.filteredTeams.sort((a, b) => {
      let compareA = a[this.sortColumn] ?? '';
      let compareB = b[this.sortColumn] ?? '';

      if (typeof compareA === 'string') {
        compareA = compareA.toLowerCase();
        compareB = (compareB as string).toLowerCase();
      }

      if (compareA < compareB) return this.sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
    }
    return '';
  }

  applyFilter(): void {
    const filterValue = this.filter.toLowerCase();
    this.filteredTeams = this.teams.filter(team =>
      team.name?.toLowerCase().includes(filterValue)
    );
  }

  defaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultLogo;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.urlImage = '';
    this.teamForm.reset();
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      const teamData = this.teamForm.value;
      if (teamData.id) {
        this.updateTeam(teamData);
      } else {
        this.createNewTeam(teamData);
      }
      this.closeModal();
    } else {
      console.log("Formulario:", this.teamForm.value);
      this.markFormGroupTouched(this.teamForm)
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  async createNewTeam(teamData: any) {
    const formData = new FormData();
    formData.append("name", teamData.name);
    formData.append("responsible", teamData.manager);
    formData.append("phone", teamData.phone);
    formData.append("email", teamData.email);
    formData.append("need_to_pay", teamData.needToPay);
    formData.append("active", teamData.isActive);
    formData.append("category", teamData.league);
    
    if (this.selectedFile) {
      formData.append("logo_file", this.selectedFile, this.selectedFile.name);
    }

    try {
      const res = await this.adminService.createTeam(formData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    finally {
      this.getTeams();
      this.closeModal();
    }
  }

  async updateTeam(teamData: any) {

    const formData = new FormData();
    formData.append("name", teamData.name);
    formData.append("responsible", teamData.manager);
    formData.append("phone", teamData.phone);
    formData.append("email", teamData.email);
    formData.append("need_to_pay", teamData.needToPay);
    formData.append("active", teamData.isActive);
    formData.append("category", teamData.league);
    
    if (this.selectedFile) {
      formData.append("logo_file", this.selectedFile, this.selectedFile.name);
    }

    try {
      const res = await this.adminService.updateTeam(formData);
    } catch (error) {
      console.log(error);
    }

    finally {
      this.getTeams();
      this.closeModal();
    }
  }

  handleViewDetails(team: FootballTeam): void {
    this.urlImage = team.logo_file ?? '';
    this.openModal();
    this.teamForm.patchValue(team);
  }

  handleEdit(team: FootballTeam): void {
    this.teamForm.patchValue({
      id: team.id,
      name: team.name,
      manager: team.responsible,
      league: team.category,
      stadium: team.documents,
      phone: team.phone,
      email: team.email,
      isActive: team.active,
      hasSanctions: team.activeSanctions,
      needToPay: team.need_to_pay
    });
    this.urlImage = team.logo_file ?? ''; 
    this.openModal();
  }

  handleDelete(id: number): void {
    // Implementar la eliminación del equipo
  }

  async getCategories() {
    const res = await this.serviceEstadistica.getCategories();
    this.leagues = res;
  }

  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.urlImage = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  findCategoryName(id: number): string {
    const category = this.leagues.find(league => league.id === id);
    return category ? category.name : '';
  }

  goBack() {
    this.router.navigate(['/admin/']);
  }
}
