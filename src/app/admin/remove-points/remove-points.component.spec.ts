import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePointsComponent } from './remove-points.component';

describe('RemovePointsComponent', () => {
  let component: RemovePointsComponent;
  let fixture: ComponentFixture<RemovePointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemovePointsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemovePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
