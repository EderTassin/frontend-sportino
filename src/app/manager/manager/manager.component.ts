import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../manager.service';


export interface Player {
  id: number;
  name: string;
  email: string;
  birthDate: Date;
  dni: string;
  photo: string;
  goals: number;
  assists: number;
  penalties: number;
  active: boolean;
}

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  players: Player[] = [];
  
  
  constructor(private managerService: ManagerService) { }

  ngOnInit() {

    this.players = [{
      id: 1, name: 'Juan', email: 'juan@gmail.com', dni: '123456789', photo: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Adrian', goals: 0, assists: 0, penalties: 0, active: true,
      birthDate: new Date(),
    },
    {
      id: 2, name: 'Pedro', email: 'pedro@gmail.com', dni: '987654321', photo: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Beto', goals: 0, assists: 0, penalties: 0, active: false,
      birthDate: new Date(),
    },
    {
      id: 3, name: 'Maria', email: 'maria@gmail.com', dni: '456789123', photo: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Carla', goals: 0, assists: 0, penalties: 0, active: true,
      birthDate: new Date(),
    }
  ];
  }

}
