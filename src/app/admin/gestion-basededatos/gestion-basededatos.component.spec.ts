import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBasededatosComponent } from './gestion-basededatos.component';

describe('GestionBasededatosComponent', () => {
  let component: GestionBasededatosComponent;
  let fixture: ComponentFixture<GestionBasededatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionBasededatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionBasededatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
