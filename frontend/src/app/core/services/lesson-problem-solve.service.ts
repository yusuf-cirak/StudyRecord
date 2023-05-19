import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClientService } from 'src/app/shared/services/http-client.service';
import { UpdateBook } from '../contracts/book/update-book';
import { CreateLesson } from '../contracts/lesson/create-lesson';
import { LessonProblemSolveResponse } from '../contracts/lesson-problem-solve/lesson-problem-solve-response';

@Injectable({ providedIn: 'root' })
export class LessonProblemSolveService {
  constructor(private httpClientService: HttpClientService) {}

  getById(id: string): Observable<any> {
    return this.httpClientService
      .get<LessonProblemSolveResponse>(
        {
          controller: 'lesson-problem-solves',
        },
        id
      )
      .pipe(map((res) => res.data as any));
  }

  getAll(): Observable<any> {
    return this.httpClientService
      .get<LessonProblemSolveResponse>({
        controller: 'lesson-problem-solves',
      })
      .pipe(map((res) => res.data)) as Observable<any[]>;
  }

  create(body: CreateLesson): Observable<any> {
    return this.httpClientService
      .post<LessonProblemSolveResponse>(
        {
          controller: 'lesson-problem-solves',
        },
        body
      )
      .pipe(map((res) => res.data as any));
  }

  update(body: UpdateBook): Observable<any> {
    return this.httpClientService
      .put<LessonProblemSolveResponse>(
        {
          controller: 'lesson-problem-solves',
        },
        body
      )
      .pipe(map((res) => res.data as any));
  }

  delete(id: string) {
    return this.httpClientService.delete(
      {
        controller: 'lesson-problem-solves',
      },
      id
    );
  }
}
