import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EstadisticaPartidosService } from './service/estadistica-partidos.service';

@Component({
  selector: 'app-tabla-fixture',
  templateUrl: './tabla-fixture.component.html',
  styleUrls: ['./tabla-fixture.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TablaFixtureComponent implements OnInit {

  listPosicion: any;
  listFilterPosicion:any;
  selectCategoria: string = "LIBRE";

  constructor(private serviceEstadistica:EstadisticaPartidosService) { }

  ngOnInit() {
    this.getPosiciones();
  }

  async getPosiciones(){
    const category = this.selectCategoria;
    this.listPosicion = await this.serviceEstadistica.getPosiciones(category);
  }
}
