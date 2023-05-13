import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Lesson } from '../api/lesson';
import { LessonService } from '../services/lesson.service';

@Injectable({
  providedIn: 'root',
})
export class LessonListResolver implements Resolve<Lesson[]> {
  constructor(private lessonService: LessonService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Lesson[]> {
    return this.lessonService.getAll();
  }
}
