import { TestBed } from '@angular/core/testing';

import { LessonProblemSolveListResolver } from './lesson-problem-solve-list.resolver';

describe('LessonProblemSolveListResolver', () => {
  let resolver: LessonProblemSolveListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LessonProblemSolveListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
