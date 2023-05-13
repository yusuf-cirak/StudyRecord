import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClientService } from 'src/app/shared/services/http-client.service';
import { Book } from '../api/book';
import { CreateBook } from '../contracts/book/create-book';
import { UpdateBook } from '../contracts/book/update-book';
import { Lesson } from '../api/lesson';
import { LessonResponse } from '../contracts/lesson/lesson-response';
import { CreateLesson } from '../contracts/lesson/create-lesson';

@Injectable({ providedIn: 'root' })
export class LessonService {
  constructor(private httpClientService: HttpClientService) {}

  getById(lesson_id: string): Observable<Lesson> {
    return this.httpClientService
      .get<LessonResponse>(
        {
          controller: 'lessons',
        },
        lesson_id
      )
      .pipe(map((res) => res.data as Lesson));
  }

  getAll(): Observable<Lesson[]> {
    return this.httpClientService
      .get<LessonResponse>({
        controller: 'lessons',
      })
      .pipe(map((res) => res.data)) as Observable<Book[]>;
  }

  create(body: CreateLesson): Observable<Lesson> {
    return this.httpClientService
      .post<LessonResponse>(
        {
          controller: 'lessons',
        },
        body
      )
      .pipe(map((res) => res.data as Lesson));
  }

  update(body: UpdateBook): Observable<Lesson> {
    return this.httpClientService
      .put<LessonResponse>(
        {
          controller: 'lessons',
        },
        body
      )
      .pipe(map((res) => res.data as Lesson));
  }

  delete(lesson_id: string) {
    return this.httpClientService.delete(
      {
        controller: 'lessons',
      },
      lesson_id
    );
  }
}
