import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EstadisticaPartidosService } from './service/estadistica-partidos.service';

interface Match {
  homeTeam: string;
  homeLogo: string;
  homeScore: number;
  awayTeam: string;
  awayLogo: string;
  awayScore: number;
  date: string;
  time: string;
}
@Component({
  selector: 'app-tabla-fixture',
  templateUrl: './tabla-fixture.component.html',
  styleUrls: ['./tabla-fixture.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class TablaFixtureComponent implements OnInit {

  matches: Match[] = [
    {
      homeTeam: 'Los Charrúas',
      homeLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKJkwVhSBjhj-MfuODjrEN9Bod9vWK2RTbvg&s',
      homeScore: 7,
      awayTeam: 'Celeste Mecánica',
      awayLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxQfNm4Tb7SqzwB8Ie8iG0Eh-oxu0qcT3X3A&s',
      awayScore: 6,
      date: '27/05/2024',
      time: '21:00 hs'
    },
    {
      homeTeam: 'Sporting Branca',
      homeLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmfnzC8tfV0yvoA15Hude551Wo156IAeOiDQ&s',
      homeScore: 5,
      awayTeam: 'Chosma FC',
      awayLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH8YuWb7QRJ4lsl9cthPr6CYcNxcuixMbhig&s',
      awayScore: 4,
      date: '27/05/2024',
      time: '21:00 hs'
    },
    {
      homeTeam: 'Los Wichis',
      homeLogo: 'path/to/logo5.png',
      homeScore: 3,
      awayTeam: 'Fanta fc',
      awayLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPiQGfbMkPvQbq7aaVaUNn_-tPfyRXtcBSuA&s',
      awayScore: 5,
      date: '27/05/2024',
      time: '22:00 hs'
    },
    {
      homeTeam: 'La Docta FC',
      homeLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0HuCQdeHMWuxEXzs-BiFZKkfwfaNKqNJRUQ&s',
      homeScore: 13,
      awayTeam: 'Titanes FC',
      awayLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcBP5d4jVB3848760VJJuWiMnzPZBeygGPWQ&s',
      awayScore: 1,
      date: '27/05/2024',
      time: '22:00 hs'
    },
    {
      homeTeam: 'Celta de Vino',
      homeLogo: 'path/to/logo9.png',
      homeScore: 2,
      awayTeam: 'Los Barats',
      awayLogo: 'path/to/logo10.png',
      awayScore: 4,
      date: '27/05/2024',
      time: '23:00 hs'
    }
  ];

  positions = [
    { team: 'Entraste Debil FC', points: 24, logo: 'ruta/logo1.png' },
    { team: 'La Butteler', points: 16, logo: 'ruta/logo2.png' },
    { team: 'Deche FC', points: 16, logo: 'ruta/logo3.png' },
    { team: 'Peppa Pig', points: 14, logo: 'ruta/logo4.png' },
    { team: 'La Societa FC', points: 13, logo: 'ruta/logo5.png' },
    { team: 'C.D Independencia', points: 13, logo: 'ruta/logo6.png' },
    { team: 'Belladona', points: 11, logo: 'ruta/logo7.png' },
    { team: 'La Leti', points: 9, logo: 'ruta/logo8.png' },
    { team: 'La Cuadra FC', points: 7, logo: 'ruta/logo9.png' },
    { team: 'La Escabieta', points: 7, logo: 'ruta/logo10.png' }
  ];


  listPosicion: any;
  listFilterPosicion:any;
  selectCategoria: string = "LIBRE";
  selectedTab: string = 'Fixture';
  defaultLogo: string = 'https://static.vecteezy.com/system/resources/previews/000/356/368/non_2x/leader-of-group-vector-icon.jpg';


  constructor(private serviceEstadistica:EstadisticaPartidosService) { }

  ngOnInit() {
    this.getPosiciones();
  }

  async getPosiciones(){
    const category = this.selectCategoria;
    this.listPosicion = await this.serviceEstadistica.getPosiciones(category);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  defaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultLogo;
  }
}
