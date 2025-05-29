import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadisticaPartidosService } from 'src/app/home/tabla-fixture/service/estadistica-partidos.service';
import { AdminService } from '../service/admin.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ManagerService } from 'src/app/manager/manager.service';

interface FootballTeam {
  id: number;
  name?: string;
  responsible?: string;
  documents?: string;
  phone?: string;
  email?: string;
  pictureFile?: string | null;
  logo_file?: string | null;
  need_to_pay?: boolean;
  active?: boolean;
  category?: {
    id?: number;
    name?: string;
  } | null;
  company?: string | null;
  activeSanctions?: boolean;
  manager?: {
    id?: number;
    username?: string;
  } 
}

interface Player {
  id: number;
  full_name: string;
  birthday: string;
  id_card: string;
  year: string;
  street: string;
  number: string;
  neighborhood: string;
  phone: string;
  cell_phone: string;
  email: string;
  picture_file: string | null;
  medical_certificate: boolean;
  date_certificate: string | null;
  date: string;
  active: boolean;
  team: number;
  active_sanctions: boolean;
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
  isPlayersModalOpen = false;
  isImageEnlarged = false;
  isDeleteModalOpen = false;
  enlargedImageSrc = '';
  teamToDelete: number | null = null;
  selectedTeam: FootballTeam | null = null;
  teamPlayers: Player[] = [];
  defaultLogo: string = 'https://static.vecteezy.com/system/resources/previews/000/356/368/non_2x/leader-of-group-vector-icon.jpg';
  defaultTeamPhoto: string = '';
  teamForm: FormGroup;
  urlImage: string = '';
  leagues: any[] = [];
  sortColumn: keyof FootballTeam = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortedTeams: FootballTeam[] = [];
  selectedFile: File | null = null;
  currentTeamPlayers: any[] = [];
  urlEnvironment: string = environment.apiEndpoint.replace('/api/', '');

  constructor(private fb: FormBuilder, 
      private serviceEstadistica: EstadisticaPartidosService,
      private adminService: AdminService,
      private playerService: ManagerService,
      private router: Router) {
    this.teamForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
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
    
    this.urlEnvironment = environment.apiEndpoint.replace('/api/', '');
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
    this.currentTeamPlayers = [];
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
    formData.append("id", teamData.id);
    formData.append("name", teamData.name);
    formData.append("responsible", teamData.manager);
    formData.append("phone", teamData.phone || '');
    formData.append("email", teamData.email || '');
    formData.append("need_to_pay", teamData.needToPay.toString());
    formData.append("active", teamData.isActive.toString());
    formData.append("category", teamData.league.toString());
    formData.append("active_sanctions", teamData.hasSanctions.toString());
    
    if (this.selectedFile) {
      formData.append("logo_file", this.selectedFile, this.selectedFile.name);
    }
    
    try {
      const res = await this.adminService.updateTeam(formData);
      console.log(res);
    } catch (error: any) {
      console.error('Error updating team:', error.message);
    } finally {
      this.getTeams();
      this.closeModal();
    }
  }

  handleViewDetails(team: FootballTeam): void {
    this.urlImage = this.urlEnvironment + team.logo_file || '';
    this.openModal();
    this.teamForm.patchValue(team);
  }

  handleEdit(team: any): void {
    this.urlImage = this.urlEnvironment + team.logo_file || '';
    
    this.currentTeamPlayers = team.players || [];
    
    this.teamForm.patchValue({
      id: team.id,
      name: team.name,
      manager: team.manager?.username || team.responsible || '',
      league: team.category?.id || '',
      phone: team.phone || '',
      email: team.email || '',
      isActive: team.active || false,
      hasSanctions: team.active_sanctions || false,
      needToPay: team.need_to_pay || false
    });
    
    this.openModal();
  }

  handleDelete(id: number): void {
    this.teamToDelete = id;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (this.teamToDelete) {
      this.adminService.deleteTeam(this.teamToDelete).subscribe(() => {
        this.getTeams();
        this.closeDeleteModal();
      });
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.teamToDelete = null;
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

  openPlayersModal(team: FootballTeam): void {
    this.selectedTeam = team;
    this.getTeamPlayers(team.id);
    this.isPlayersModalOpen = true;
  }

  closePlayersModal(): void {
    this.isPlayersModalOpen = false;
    this.selectedTeam = null;
    this.teamPlayers = [];
  }

  getTeamPlayers(teamId: number) {
    try {
      const result = this.playerService.getTeam(teamId);
      result.subscribe((data: any) => {
        this.teamPlayers = data.players as Player[];
      }); 
    } catch (error) {
      console.error('Error fetching team players:', error);
      this.teamPlayers = [];
    }
  }

  enlargeImage(player: Player): void {
    if (player.picture_file) {
      this.enlargedImageSrc = this.urlEnvironment + player.picture_file;
      this.isImageEnlarged = true;
    }
  }

  closeEnlargedImage(): void {
    this.isImageEnlarged = false;
    this.enlargedImageSrc = '';
  }

  async toggleMedicalCertificate(player: Player): Promise<void> {
    try {
      player.medical_certificate = !player.medical_certificate;
      
      const updateData = {
        id: player.id,
        medical_certificate: player.medical_certificate,
      };
      
      this.playerService.updatePlayerMedicalCertificate(updateData).subscribe((data: any) => {
      });
      
    } catch (error) {
      player.medical_certificate = !player.medical_certificate;
    }
  }
}
