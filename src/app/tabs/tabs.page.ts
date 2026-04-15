import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, pricetagsOutline, settingsOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';
import { FeatureFlagService } from '../services/feature-flag.service';

/**
 * TabsPage — Layout principal con navegación por pestañas.
 *
 * Implementa `ion-tabs` + `ion-tab-bar` como OBLIGATORIO según skill ionic-skills.
 *
 * La pestaña de categorías se muestra/oculta según el feature flag
 * `categories_enabled` obtenido de Firebase Remote Config.
 *
 * @standalone — Componente independiente sin NgModule.
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    NgIf,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    TranslateModule,
  ],
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  /** Si la pestaña de categorías debe mostrarse */
  showCategories: boolean;

  constructor(private featureFlagService: FeatureFlagService) {
    addIcons({ listOutline, pricetagsOutline, settingsOutline });
    this.showCategories = this.featureFlagService.isEnabled('categories_enabled');
  }
}
