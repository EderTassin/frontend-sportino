import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirDocumentosComponent } from './imprimir-documentos.component';

describe('ImprimirDocumentosComponent', () => {
  let component: ImprimirDocumentosComponent;
  let fixture: ComponentFixture<ImprimirDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprimirDocumentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprimirDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
