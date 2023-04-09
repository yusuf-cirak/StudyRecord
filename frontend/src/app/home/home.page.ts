import { Store } from '@ngrx/store';
import { Component, HostListener } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AppState } from '../app.state';
import { count } from '../shared/state/count/count.selectors';
import { incrementBy } from '../shared/state/count/count.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage {
  constructor(private appStore: Store<AppState>) {}

  count$ = this.appStore.select(count);

  @HostListener('click') clickHandler() {
    this.appStore.dispatch(incrementBy({ count: 1 }));
  }
}
