import { TestBed } from '@angular/core/testing';

import { ApiPampersService } from './api-pampers.service';

describe('ApiPampersService', () => {
  let service: ApiPampersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPampersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
