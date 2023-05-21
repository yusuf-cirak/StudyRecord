import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonProblemSolveChartPage } from './lesson-problem-solve-chart.page';

describe('LessonProblemSolveChartPage', () => {
  let component: LessonProblemSolveChartPage;
  let fixture: ComponentFixture<LessonProblemSolveChartPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LessonProblemSolveChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
