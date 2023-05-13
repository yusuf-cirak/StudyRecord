import { TestBed } from '@angular/core/testing';

import { LessonListResolver } from './lesson-list.resolver';

describe('LessonListResolver', () => {
  let resolver: LessonListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LessonListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
