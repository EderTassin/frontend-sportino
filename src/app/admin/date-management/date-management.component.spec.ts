import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateManagementComponent } from './date-management.component';

describe('DateManagementComponent', () => {
  let component: DateManagementComponent;
  let fixture: ComponentFixture<DateManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
