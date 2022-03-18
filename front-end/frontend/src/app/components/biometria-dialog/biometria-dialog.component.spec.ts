import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometriaDialogComponent } from './biometria-dialog.component';

describe('BiometriaDialogComponent', () => {
  let component: BiometriaDialogComponent;
  let fixture: ComponentFixture<BiometriaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiometriaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
