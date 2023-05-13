import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { BookService } from '../services/book.service';
import { Book } from '../api/book';

@Injectable({
  providedIn: 'root',
})
export class BookListResolver implements Resolve<Book[]> {
  constructor(private bookService: BookService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Book[]> {
    return this.bookService.getAll();
  }
}
