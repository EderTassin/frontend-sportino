import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerImgPortadaComponent } from './manager-img-portada.component';

describe('ManagerImgPortadaComponent', () => {
  let component: ManagerImgPortadaComponent;
  let fixture: ComponentFixture<ManagerImgPortadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerImgPortadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerImgPortadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
