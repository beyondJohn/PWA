import { TestBed } from '@angular/core/testing';

import { GetImageDbService } from './get-image-db.service';

describe('GetImageDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetImageDbService = TestBed.get(GetImageDbService);
    expect(service).toBeTruthy();
  });
});
