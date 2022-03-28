import { TestBed } from '@angular/core/testing';

import { CadastroProdutoService } from './cadastro-produto.service';

describe('CadastroProdutoService', () => {
  let service: CadastroProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadastroProdutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
