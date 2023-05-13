import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BookService } from '../services/book.service';
import { Book } from '../api/book';

@Injectable({
  providedIn: 'root',
})
export class BookResolver implements Resolve<Book> {
  constructor(private bookService: BookService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Book> {
    const { id } = route.params;
    return this.bookService.getById(id);
  }
}
