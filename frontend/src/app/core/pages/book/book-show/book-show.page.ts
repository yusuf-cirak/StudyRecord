import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/core/services/book.service';
import { Book } from 'src/app/core/api/book';

@Component({
  selector: 'app-book-show',
  templateUrl: './book-show.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class BookShowPage implements OnInit {
  form!: FormGroup;
  id = '';
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      book_id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
    });

    const book = this.route.snapshot.data['book'] as Book;
    if (book) {
      this.id = book.id;
      this.form.patchValue({ book_id: book.id, name: book.name });
    }
  }

  save(formValues: Book) {
    if (this.id) {
      this.bookService.update(formValues).subscribe({
        next: () => {
          this.router.navigate(['/book-list']);
        },
      });
    } else {
      this.bookService.create(formValues).subscribe({
        next: () => {
          this.router.navigate(['/book-list']);
        },
      });
    }
  }
}
