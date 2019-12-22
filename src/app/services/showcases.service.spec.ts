import { TestBed } from '@angular/core/testing';

import { ShowcasesService } from './showcases.service';

describe('ShowcasesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowcasesService = TestBed.get(ShowcasesService);
    expect(service).toBeTruthy();
  });
});
