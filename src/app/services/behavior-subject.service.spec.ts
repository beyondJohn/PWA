import { TestBed } from '@angular/core/testing';

import { BehaviorSubjectService } from './behavior-subject.service';

describe('BehaviorSubjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BehaviorSubjectService = TestBed.get(BehaviorSubjectService);
    expect(service).toBeTruthy();
  });
});
