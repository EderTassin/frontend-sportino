import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatesFormComponent } from './dates-form.component';

describe('DatesFormComponent', () => {
  let component: DatesFormComponent;
  let fixture: ComponentFixture<DatesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
