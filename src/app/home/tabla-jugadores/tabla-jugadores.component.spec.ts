/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TablaJugadoresComponent } from './tabla-jugadores.component';

describe('TablaJugadoresComponent', () => {
  let component: TablaJugadoresComponent;
  let fixture: ComponentFixture<TablaJugadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaJugadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaJugadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the main container in the template', () => {
    const container = fixture.debugElement.query(By.css('.tabla-jugadores-container'));
    expect(container).toBeTruthy();
  });
});
