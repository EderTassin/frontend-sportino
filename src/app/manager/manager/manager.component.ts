import { Component, OnInit } from '@angular/core';
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
  active: boolean;
  street: string;
  year: string;
  phone: string;
  cell_phone: string;
  medical_certificate: string;
  date_certificate: Date;
  date: Date;
  team: number;
  id_card: string;
  picture_file: string;
  birthday: Date;
}

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  players: Player[] = [];
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
      this.players = res.players;
      this.team = res;
    });
  }

  openModalPlayer() {
    if (this.team.manager.active) {
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    this.newPlayer.birthDate = new Date(this.newPlayer.birthDate);
    
    this.managerService.addPlayer(this.newPlayer, this.teamId, this.selectedFile).subscribe(
      (response) => {
        this.players.push(response);
        this.newPlayer = {} as Player;
        this.selectedFile = null;
        this.closeModal();
      },
      (error) => {
        console.error('Error adding player:', error);
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
    this.selectedPlayer.birthDate = new Date(this.selectedPlayer.birthday);
    
    this.managerService.updatePlayer(this.selectedPlayer, this.selectedFile).subscribe(
      (response) => {
        const index = this.players.findIndex(player => player.id === this.selectedPlayer.id);
        this.players[index] = response;
        this.selectedPlayer = {} as Player;
        this.closeEditModal();
      },
      (error) => {
        console.error('Error updating player:', error);
      }
    );
  }

  closeEditModal() {
    this.showEditModal = false;
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
}
