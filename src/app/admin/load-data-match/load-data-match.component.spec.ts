import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDataMatchComponent } from './load-data-match.component';

describe('LoadDataMatchComponent', () => {
  let component: LoadDataMatchComponent;
  let fixture: ComponentFixture<LoadDataMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadDataMatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDataMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
