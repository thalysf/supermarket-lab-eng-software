import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTelasComponent } from './menu-telas.component';

describe('MenuTelasComponent', () => {
  let component: MenuTelasComponent;
  let fixture: ComponentFixture<MenuTelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuTelasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuTelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
