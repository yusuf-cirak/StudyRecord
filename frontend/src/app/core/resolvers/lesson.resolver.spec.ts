import { TestBed } from '@angular/core/testing';

import { LessonResolver } from './lesson.resolver';

describe('LessonResolver', () => {
  let resolver: LessonResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LessonResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
