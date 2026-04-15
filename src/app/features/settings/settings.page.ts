import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonSelect, IonSelectOption, IonNote } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { languageOutline, colorPaletteOutline, informationCircleOutline } from 'ionicons/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-settings', standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonSelect, IonSelectOption, IonNote, TranslateModule],
  templateUrl: './settings.page.html', styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currentLang = 'en'; currentTheme = 'system';
  constructor(private translate: TranslateService) { addIcons({ languageOutline, colorPaletteOutline, informationCircleOutline }); }

  async ngOnInit(): Promise<void> {
    this.currentLang = this.translate.currentLang || 'en';
    const { value: savedTheme } = await Preferences.get({ key: 'taskflow_theme' });
    if (savedTheme) this.currentTheme = savedTheme;
  }

  async changeLanguage(event: CustomEvent): Promise<void> {
    const lang = event.detail.value as string; this.currentLang = lang;
    this.translate.use(lang); await Preferences.set({ key: 'taskflow_language', value: lang });
  }

  async changeTheme(event: CustomEvent): Promise<void> {
    const theme = event.detail.value as string; this.currentTheme = theme;
    await Preferences.set({ key: 'taskflow_theme', value: theme });
    document.body.classList.remove('dark', 'light');
    if (theme === 'dark') document.body.classList.add('dark');
    else if (theme === 'light') document.body.classList.add('light');
  }
}
