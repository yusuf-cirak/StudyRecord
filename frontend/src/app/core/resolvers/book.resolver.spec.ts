import { TestBed } from '@angular/core/testing';

import { BookResolver } from './book.resolver';

describe('BookResolver', () => {
  let resolver: BookResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BookResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
