import { Component, OnInit, HostListener } from '@angular/core';
import { ManagerService } from '../manager.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { environment } from 'src/environments/environment.prod';


export interface Player {
  id: number;
  full_name: string;
  email: string;
  birthDate: Date;
  dni: string;
  photo: string;
  goals: number;
  assists: number;
  penalties: number;
  status: string; // Reemplaza a 'active' para soportar más estados.
  active: boolean;
  street: string;
  year: string;
  phone: string;
  cell_phone: string;
  medical_certificate: string;
  date_certificate: Date;
  date: Date;
  team: Team;
  id_card: string;
  picture_file: string;
  birthday: Date;
}

export interface Team {
  id: number;
  name: string;
}

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  openMenuPlayerId: number | null = null;
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  searchTerm: string = '';
  teamId: number = 0;
  team: any;
  showModal: boolean = false;
  newPlayer: Player = {} as Player;
  selectedFile: File | null = null;
  defaultLogo: string = 'https://static.vecteezy.com/system/resources/previews/000/356/368/non_2x/leader-of-group-vector-icon.jpg';
  selectedPlayer: Player ={} as Player;
  showEditModal: boolean = false;
  showEditTeamModal = false;
  editTeamForm = {
    name: '',
    logo_file: null
  };
  previewImage: string | ArrayBuffer | null = null;

  urlEnvironment = environment.apiEndpoint;

  
  constructor(private managerService: ManagerService, private route: ActivatedRoute, private dialog: MatDialog) { 
    this.route.params.subscribe(params => {
      this.teamId = params['id'];
    });
  }

  ngOnInit() {
    this.urlEnvironment = this.urlEnvironment.replace('/api/', '');
    this.getTeam();
  }

  getTeam(){
    this.managerService.getTeam(this.teamId).subscribe((res: any) => {
      this.team = res;
      this.players = res.players.map((player: any) => {
        const status = player.active ? 'active' : 'inactive';
        return {
          ...player,
          status,
          birthDate: new Date(player.birthday)
        };
      });
      this.filteredPlayers = this.players;
    });
  }

  openModalPlayer() {
    if (this.team.manager.active) {
      this.newPlayer = { status: 'active' } as Player;
      this.previewImage = null;
      this.selectedFile = null;
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
    this.newPlayer = {} as Player;
    this.previewImage = null;
    this.selectedFile = null;
  }

  onSubmit() {
    this.newPlayer.birthDate = new Date(this.newPlayer.birthDate);

    if (isNaN(this.newPlayer.birthDate.getTime())) {
      this.newPlayer.birthDate = new Date();
    }

    if (!this.newPlayer.email) {
      this.newPlayer.email = "default@gmail.com";
    }

    if (!this.newPlayer.dni) {
      this.newPlayer.dni = "default";
    }

    const payload: any = { ...this.newPlayer };
  
    payload.active = this.newPlayer.status === 'active';
    delete payload.status;
    delete payload.birthday;

    this.managerService.addPlayer(payload, this.teamId, this.selectedFile).subscribe(
      (response) => {
        const newPlayerWithStatus: Player = { 
          ...response, 
          status: response.active ? 'active' : 'inactive' 
        };
        this.players.push(newPlayerWithStatus);
        this.filteredPlayers = this.players; 
        this.closeModal();
      },
      (error) => {
        console.error('Error al agregar jugador', error);
      }
    );
  }

  deletePlayer(playerId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { message: '¿Estás seguro de eliminar este jugador?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.players = this.players.filter(player => player.id !== playerId);
        this.managerService.deletePlayer(playerId).subscribe(() => {
          this.getTeam();
        });
        this.filteredPlayers = this.players; 
      }
    });
  }

  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo es 2MB.');
        return;
      }
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  defaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultLogo;
  }

  openModalEditPlayer(player: Player) {
    this.selectedPlayer = { ...player };  
    if (this.team.manager.active) {
      this.showEditModal = true;
    }
  }

  onSubmitEdit() {
    this.selectedPlayer.birthDate = new Date(this.selectedPlayer.birthDate);

    if (isNaN(this.selectedPlayer.birthDate.getTime())) {
      this.selectedPlayer.birthDate = new Date();
    }

    const payload: any = { ...this.selectedPlayer };
    payload.active = this.selectedPlayer.status === 'active';
    payload.birthday = this.selectedPlayer.birthDate.toISOString().split('T')[0];
    
    delete payload.status;
    delete payload.birthDate;

    this.managerService.updatePlayer(payload, this.selectedFile).subscribe(
      (response) => {
        const updatedPlayerWithStatus: Player = { 
          ...response, 
          status: response.active ? 'active' : 'inactive',
          birthDate: new Date(response.birthday)
        };
        const index = this.players.findIndex(p => p.id === this.selectedPlayer.id);
        if (index !== -1) {
          this.players[index] = updatedPlayerWithStatus;
        }
        this.filteredPlayers = this.players;
        this.closeEditModal();
      },
      (error) => {
        console.error('Error al actualizar jugador', error);
      }
    );
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedPlayer = {} as Player;
    this.previewImage = null;
    this.selectedFile = null;
  }

  openEditTeamModal() {
    this.editTeamForm.name = this.team?.name || '';
    this.previewImage = null;
    this.showEditTeamModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo es 2MB.');
        return;
      }
      
      this.editTeamForm.logo_file = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateTeamInfo() {
    const formData = new FormData();

    
    formData.append('name', this.editTeamForm.name);
    if (this.editTeamForm.logo_file) {
      formData.append('logo_file', this.editTeamForm.logo_file);
    }
    
    this.managerService.updateTeamData(formData, this.teamId).subscribe(
      (response) => {
        this.showEditTeamModal = false;
        this.getTeam();
      },
      (error) => {
        console.error('Error al actualizar el equipo:', error);
      }
    );
  }

  filterPlayers(): void {
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    if (!searchTermLower) {
      this.filteredPlayers = this.players;
      return;
    }

    this.filteredPlayers = this.players.filter(player =>
      player.full_name.toLowerCase().includes(searchTermLower) ||
      (player.email && player.email.toLowerCase().includes(searchTermLower)) ||
      (player.id_card && player.id_card.toLowerCase().includes(searchTermLower))
    );
  }

  togglePlayerMenu(event: MouseEvent, playerId: number): void {
    event.stopPropagation();
    this.openMenuPlayerId = this.openMenuPlayerId === playerId ? null : playerId;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuPlayerId = null;
  }
}
