import { TestBed } from '@angular/core/testing';

import { ApiBoardService } from './api-board.service';

describe('ApiBoardService', () => {
  let service: ApiBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
