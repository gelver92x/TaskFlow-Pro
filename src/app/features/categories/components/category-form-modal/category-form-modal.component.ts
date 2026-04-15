import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonInput, IonItem, IonList, IonText, IonIcon, IonLabel, ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { briefcaseOutline, personOutline, cartOutline, alertCircleOutline, bookOutline, fitnessOutline, homeOutline, schoolOutline, codeSlashOutline, musicalNotesOutline, airplaneOutline, heartOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-category-form-modal', standalone: true,
  imports: [FormsModule, NgStyle, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonInput, IonItem, IonList, IonText, IonIcon, IonLabel, TranslateModule],
  templateUrl: './category-form-modal.component.html', styleUrls: ['./category-form-modal.component.scss'],
})
export class CategoryFormModalComponent implements OnInit {
  @Input() category?: Category;
  categoryName = ''; selectedColor = '#4C8DFF'; selectedIcon = 'briefcase-outline'; submitted = false; isEditing = false;
  colorOptions = ['#4C8DFF','#22C55E','#FFC409','#EF4444','#8B5CF6','#06B6D4','#F59E0B','#EC4899','#14B8A6','#6366F1','#78716C','#0EA5E9'];
  iconOptions = ['briefcase-outline','person-outline','cart-outline','alert-circle-outline','book-outline','fitness-outline','home-outline','school-outline','code-slash-outline','musical-notes-outline','airplane-outline','heart-outline'];

  constructor(private modalCtrl: ModalController) {
    addIcons({ briefcaseOutline, personOutline, cartOutline, alertCircleOutline, bookOutline, fitnessOutline, homeOutline, schoolOutline, codeSlashOutline, musicalNotesOutline, airplaneOutline, heartOutline });
  }
  ngOnInit(): void {
    if (this.category) { this.isEditing = true; this.categoryName = this.category.name; this.selectedColor = this.category.color; this.selectedIcon = this.category.icon; }
  }
  selectColor(color: string): void { this.selectedColor = color; }
  selectIcon(icon: string): void { this.selectedIcon = icon; }
  cancel(): void { this.modalCtrl.dismiss(null, 'cancel'); }
  save(): void {
    this.submitted = true;
    const name = this.categoryName.trim();
    if (!name) return;
    this.modalCtrl.dismiss({ name, color: this.selectedColor, icon: this.selectedIcon }, 'save');
  }
}
