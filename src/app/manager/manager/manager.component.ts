import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../manager.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';


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

  
  constructor(private managerService: ManagerService, private route: ActivatedRoute, private dialog: MatDialog) { 
    this.route.params.subscribe(params => {
      this.teamId = params['id'];
    });
  }

  ngOnInit() {
    this.getTeam();
  }

  getTeam(){
    this.managerService.getTeam(this.teamId).subscribe((res: any) => {
      console.log(res);
      this.players = res.players;
      this.team = res;
    });
  }

  openModalPlayer() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    console.log(this.newPlayer);
    console.log(this.teamId);
    this.newPlayer.birthDate = new Date(this.newPlayer.birthDate);
    
    this.managerService.addPlayer(this.newPlayer, this.teamId, this.selectedFile).subscribe(
      (response) => {
        console.log('Player added successfully:', response);
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
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newPlayer.photo = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  defaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultLogo;
  }

  openModalEditPlayer(player: Player) {
    this.selectedPlayer = { ...player };

    console.log(this.selectedPlayer);
    this.showEditModal = true;
  }

  onSubmitEdit() {
    this.selectedPlayer.birthDate = new Date(this.selectedPlayer.birthday);
    
    this.managerService.updatePlayer(this.selectedPlayer, this.selectedFile).subscribe(
      (response) => {
        console.log('Player updated successfully:', response);
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
}
