import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  RouterModule,
  provideRouter,
} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(
      HttpClientModule,
      IonicModule.forRoot({}),
      StoreModule.forRoot(appReducer),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
    ),
    provideRouter(routes),
  ],
});
