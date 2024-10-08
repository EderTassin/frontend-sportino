import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  team: any = {};
  players: any[] = [];
  newPlayer: any = {};
  editingPlayer: any = null;

  constructor(private managerService: ManagerService) { }

  ngOnInit(): void {
    this.loadTeamData();
    this.loadPlayers();
  }

  loadTeamData() {
    this.managerService.getTeamData().subscribe(
      (data) => {
        this.team = data;
      },
      (error) => {
        console.error('Error loading team data:', error);
      }
    );
  }

  loadPlayers() {
    this.managerService.getPlayers().subscribe(
      (data) => {
        this.players = data;
      },
      (error) => {
        console.error('Error loading players:', error);
      }
    );
  }

  saveTeamData() {
    this.managerService.updateTeamData(this.team).subscribe(
      () => {
        alert('Team data saved successfully');
      },
      (error) => {
        console.error('Error saving team data:', error);
      }
    );
  }

  addPlayer() {
    this.managerService.addPlayer(this.newPlayer).subscribe(
      (player) => {
        this.players.push(player);
        this.newPlayer = {};
      },
      (error) => {
        console.error('Error adding player:', error);
      }
    );
  }

  editPlayer(player: any) {
    this.editingPlayer = { ...player };
  }

  updatePlayer() {
    this.managerService.updatePlayer(this.editingPlayer).subscribe(
      (updatedPlayer) => {
        const index = this.players.findIndex(p => p.id === updatedPlayer.id);
        if (index !== -1) {
          this.players[index] = updatedPlayer;
        }
        this.editingPlayer = null;
      },
      (error) => {
        console.error('Error updating player:', error);
      }
    );
  }

  deletePlayer(playerId: number) {
    if (confirm('Are you sure you want to delete this player?')) {
      this.managerService.deletePlayer(playerId).subscribe(
        () => {
          this.players = this.players.filter(p => p.id !== playerId);
        },
        (error) => {
          console.error('Error deleting player:', error);
        }
      );
    }
  }
}
