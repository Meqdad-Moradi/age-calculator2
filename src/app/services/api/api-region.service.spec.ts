import { TestBed } from '@angular/core/testing';

import { ApiRegionService } from './api-region.service';

describe('ApiRegionService', () => {
  let service: ApiRegionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRegionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
