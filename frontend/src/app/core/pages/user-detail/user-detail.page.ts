import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userSelector } from 'src/app/shared/state/user/user.selectors';
import { User } from '../../api/user';
import { AppState } from 'src/app/app.state';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, NgIf, AsyncPipe],
})
export class UserDetailPage {
  user$: Observable<User>;
  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(userSelector);
  }
}
