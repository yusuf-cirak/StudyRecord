import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LessonProblemSolveService } from '../services/lesson-problem-solve.service';

@Injectable({
  providedIn: 'root',
})
export class LessonProblemSolveListResolver implements Resolve<any> {
  constructor(private lessonProblemSolveService: LessonProblemSolveService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.lessonProblemSolveService.getAll();
  }
}
