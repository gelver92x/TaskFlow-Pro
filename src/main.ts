/**
 * TaskFlow — Application Entry Point
 *
 * Bootstraps the Angular application with the following providers:
 * - IonicAngular: Ionic framework integration for standalone Angular apps.
 * - Router: Angular router with PreloadAllModules strategy for lazy-loaded pages.
 * - HttpClient: Required for @ngx-translate to load translation JSON files.
 * - TranslateService: i18n support with HTTP loader for en/es translations.
 *
 * The app uses standalone components exclusively (no NgModules).
 */
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  withHashLocation,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withHashLocation()),
    provideHttpClient(),
    provideTranslateService({
      defaultLanguage: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
});
