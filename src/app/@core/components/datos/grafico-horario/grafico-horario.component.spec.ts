import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoHorarioComponent } from './grafico-horario.component';

describe('GraficoHorarioComponent', () => {
  let component: GraficoHorarioComponent;
  let fixture: ComponentFixture<GraficoHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoHorarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
