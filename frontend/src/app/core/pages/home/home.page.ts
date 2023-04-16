import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { userSelector } from 'src/app/shared/state/user/user.selectors';
import { Observable } from 'rxjs';
import { User } from '../../api/user';

interface Page {
  url: string;
  icon: string;
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class HomePage {
  user$: Observable<User>;
  pages: Page[];
  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(userSelector);
    this.pages = [
      {
        icon: 'person-outline',
        title: 'My Profile',
        url: 'profile',
      },
    ];
  }
}
