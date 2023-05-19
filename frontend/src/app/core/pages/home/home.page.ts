import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { userSelector } from 'src/app/shared/state/user/user.selectors';
import { Observable } from 'rxjs';
import { User } from '../../api/user';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  imports: [IonicModule, NgFor, NgIf, AsyncPipe, FormsModule, RouterLink],
})
export class HomePage {
  user$: Observable<User>;
  sideBarPages: Page[];
  categoryPages: Page[];
  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(userSelector);
    this.sideBarPages = [
      {
        icon: 'person-outline',
        title: 'My Profile',
        url: 'profile',
      },
    ];

    this.categoryPages = [
      {
        icon: 'book-outline',
        url: 'book-list',
        title: 'Manage books',
      },
      {
        icon: 'school-outline',
        url: 'lesson-list',
        title: 'Manage lessons',
      },
      {
        icon: 'bar-chart-outline',
        url: 'lesson-problem-solve-list',
        title: 'Manage lesson problem solves',
      },
    ];
  }
}
