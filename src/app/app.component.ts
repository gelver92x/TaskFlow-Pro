import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';

/**
 * AppComponent — Root component of the TaskFlow application.
 *
 * Responsibilities:
 * - Renders the Ionic app shell with the router outlet.
 * - Initializes the translation service with browser language detection.
 *
 * This is a standalone component — no NgModule required.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  /**
   * Initializes language settings on app startup.
   * Detects the browser language and sets it if supported,
   * otherwise falls back to English.
   */
  ngOnInit(): void {
    this.translate.setDefaultLang('en');

    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'es'];

    this.translate.use(
      supportedLangs.includes(browserLang) ? browserLang : 'en'
    );
  }
}
