import { TestBed } from '@angular/core/testing';

import { ApiCountriesService } from './api-countries.service';

describe('ApiCountriesService', () => {
  let service: ApiCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
