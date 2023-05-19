import { LessonProblemSolveService } from './../services/lesson-problem-solve.service';
import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LessonProblemSolveResolver implements Resolve<any> {
  constructor(private lspService: LessonProblemSolveService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const { id } = route.params;
    return this.lspService.getById(id);
  }
}
