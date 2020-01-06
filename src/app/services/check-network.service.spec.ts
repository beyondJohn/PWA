import { TestBed } from '@angular/core/testing';

import { CheckNetworkService } from './check-network.service';

describe('CheckNetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckNetworkService = TestBed.get(CheckNetworkService);
    expect(service).toBeTruthy();
  });
});
