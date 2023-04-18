import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  constructor() {
    defineCustomElements(window);
  }
}
