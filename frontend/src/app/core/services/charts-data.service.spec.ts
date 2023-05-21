import { TestBed } from '@angular/core/testing';

import { ChartsDataService } from './charts-data.service';

describe('ChartsDataService', () => {
  let service: ChartsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
