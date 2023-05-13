import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClientService } from 'src/app/shared/services/http-client.service';
import { Book } from '../api/book';
import { CreateBook } from '../contracts/book/create-book';
import { UpdateBook } from '../contracts/book/update-book';
import { BookResponse } from '../contracts/book/book-response';

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private httpClientService: HttpClientService) {}

  getById(book_id: string): Observable<Book> {
    return this.httpClientService
      .get<BookResponse>(
        {
          controller: 'books',
        },
        book_id
      )
      .pipe(map((res) => res.data as Book));
  }

  getAll(): Observable<Book[]> {
    return this.httpClientService
      .get<BookResponse>({
        controller: 'books',
      })
      .pipe(map((res) => res.data)) as Observable<Book[]>;
  }

  create(body: CreateBook): Observable<Book> {
    return this.httpClientService
      .post<BookResponse>(
        {
          controller: 'books',
        },
        body
      )
      .pipe(map((res) => res.data as Book));
  }

  update(body: UpdateBook): Observable<Book> {
    return this.httpClientService
      .put<BookResponse>(
        {
          controller: 'books',
        },
        body
      )
      .pipe(map((res) => res.data as Book));
  }

  delete(book_id: string) {
    return this.httpClientService.delete(
      {
        controller: 'books',
      },
      book_id
    );
  }
}
