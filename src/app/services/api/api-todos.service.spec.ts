import { TestBed } from '@angular/core/testing';

import { ApiTodosService } from './api-todos.service';

describe('ApiTodosService', () => {
  let service: ApiTodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTodosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
