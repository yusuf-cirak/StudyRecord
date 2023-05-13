import { TestBed } from '@angular/core/testing';

import { BookListResolver } from './book-list.resolver';

describe('BookListResolver', () => {
  let resolver: BookListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BookListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
