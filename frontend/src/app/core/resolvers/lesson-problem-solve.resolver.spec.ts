import { TestBed } from '@angular/core/testing';

import { LessonProblemSolveResolver } from './lesson-problem-solve.resolver';

describe('LessonProblemSolveResolver', () => {
  let resolver: LessonProblemSolveResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LessonProblemSolveResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
