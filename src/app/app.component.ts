import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';
import { FeatureFlagService } from './services/feature-flag.service';

/**
 * AppComponent — Componente raíz de la aplicación TaskFlow.
 *
 * Responsabilidades:
 * - Renderiza el shell de Ionic con el router outlet.
 * - Inicializa el servicio de traducciones con detección de idioma.
 * - Carga la preferencia de idioma guardada.
 * - Inicializa los feature flags desde Firebase Remote Config.
 *
 * Este es un componente standalone — no requiere NgModule.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private featureFlagService: FeatureFlagService
  ) {}

  /**
   * Inicializa idioma y feature flags al arrancar la app.
   */
  async ngOnInit(): Promise<void> {
    // Configurar idioma
    this.translate.setDefaultLang('en');

    const { value: savedLang } = await Preferences.get({ key: 'taskflow_language' });
    if (savedLang) {
      this.translate.use(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'es'];
      this.translate.use(
        supportedLangs.includes(browserLang) ? browserLang : 'en'
      );
    }

    // Inicializar feature flags
    await this.featureFlagService.initialize();
  }
}
