import { map, tap } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonAlert, IonModal, IonicModule, NavController } from '@ionic/angular';
import { Book } from 'src/app/core/api/book';
import { BookService } from 'src/app/core/services/book.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
})
export class BookListPage implements OnInit {
  private _books: Book[] = [];
  books: Book[] = [];

  public alertButtons: { text: string; role: string; cssClass: string }[] = [];

  selectedBook!: Book;

  operation = '';

  @ViewChild('alert') alert!: IonAlert;

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('initialized!');
    this.alertButtons = [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
      },
      {
        text: 'Yes',
        role: 'confirm',
        cssClass: 'alert-button-confirm',
      },
    ];

    this.route.data.subscribe({
      next: (data) => {
        this._books = data['books'];
        this.books = [...this._books];
      },
    });
  }

  openAlert(book: Book, operation: string) {
    this.operation = operation;
    this.selectedBook = book;
    this.alert.message = `Are you sure you want to ${operation} ${book.name}?`;
    this.alert.isOpen = true;
  }

  handleAlertClick(type: string) {
    this.alert.isOpen = false;
    if (type === 'confirm') {
      if (this.operation === 'delete') {
        this.bookService.delete(this.selectedBook.id).subscribe({
          next: () => {
            this._books = this._books.filter(
              (book) => book.id !== this.selectedBook.id
            );
            this.books = [...this._books];
          },
        });
      } else {
        this.router.navigate(['', 'book-show', this.selectedBook.id]);
      }
    }
  }

  search(value: string) {
    if (!value) {
      this.books = [...this._books];
      return;
    }

    this.books = this._books.filter((book) => book.name.includes(value));
  }
}
