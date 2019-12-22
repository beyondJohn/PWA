import { TestBed } from '@angular/core/testing';

import { AppSvgsService } from './app-svgs.service';

describe('AppSvgsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppSvgsService = TestBed.get(AppSvgsService);
    expect(service).toBeTruthy();
  });
});
