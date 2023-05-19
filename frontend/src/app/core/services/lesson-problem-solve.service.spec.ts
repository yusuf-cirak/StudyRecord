import { TestBed } from '@angular/core/testing';

import { LessonProblemSolveService } from './lesson-problem-solve.service';

describe('LessonProblemSolveService', () => {
  let service: LessonProblemSolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonProblemSolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
