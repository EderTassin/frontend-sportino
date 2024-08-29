import { Component } from '@angular/core';

interface FootballTeam {
  id: number;
  name: string;
  manager: string;
  foundationYear: string;
  phone: string;
  email: string;
  teamPhoto: string | null;
  logo: string;
  hasDues: boolean;
  isActive: boolean;
  league: string;
  stadium: string | null;
  hasSanctions: boolean;
}

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent {
  teams = signal<FootballTeam[]>([
    {
      id: 8,
      name: 'Manchester United',
      manager: 'Erik ten Hag',
      foundationYear: '1878',
      phone: '+44 161 868 8000',
      email: 'enquiries@manutd.co.uk',
      teamPhoto: 'https://172.233.27.125/file/manchester_united_team.jpg',
      logo: 'https://172.233.27.125/file/manchester_united_logo.png',
      hasDues: false,
      isActive: true,
      league: 'premier',
      stadium: 'Old Trafford',
      hasSanctions: false,
    },
    // More teams...
  ]);

  filter = signal('');
  editingTeam = signal<FootballTeam | null>(null);
  isDialogOpen = signal(false);
  detailTeam = signal<FootballTeam | null>(null);

  get filteredTeams() {
    return this.teams().filter(team =>
      team.name.toLowerCase().includes(this.filter().toLowerCase())
    );
  }

  handleDelete(id: number) {
    this.teams.set(this.teams().filter(team => team.id !== id));
  }

  handleEdit(team: FootballTeam) {
    this.editingTeam.set(team);
    this.isDialogOpen.set(true);
  }

  handleSave(updatedTeam: FootballTeam) {
    if (updatedTeam.id) {
      this.teams.set(this.teams().map(team => team.id === updatedTeam.id ? updatedTeam : team));
    } else {
      this.teams.set([...this.teams(), { ...updatedTeam, id: Math.max(...this.teams().map(t => t.id)) + 1 }]);
    }
    this.isDialogOpen.set(false);
    this.editingTeam.set(null);
  }

  handleViewDetails(team: FootballTeam) {
    this.detailTeam.set(team);
  }
}
