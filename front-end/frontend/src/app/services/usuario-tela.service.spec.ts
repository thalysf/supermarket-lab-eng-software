import { TestBed } from '@angular/core/testing';

import { UsuarioTelaService } from './usuario-tela.service';

describe('UsuarioTelaService', () => {
  let service: UsuarioTelaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioTelaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
