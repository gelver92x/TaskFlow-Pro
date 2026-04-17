import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonInput, IonTextarea, IonItem, IonList, IonText, IonSelect,
  IonSelectOption, IonSegment, IonSegmentButton, IonLabel, ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Category } from '../../../../models/category.model';
import { TaskPriority } from '../../../../models/task.model';
import { CategoryService } from '../../../../services/category.service';
import { FeatureFlagService } from '../../../../services/feature-flag.service';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [FormsModule, AsyncPipe, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonInput, IonTextarea, IonItem, IonList, IonText, IonSelect, IonSelectOption, IonSegment, IonSegmentButton, IonLabel, TranslateModule],
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.scss'],
})
export class TaskFormModalComponent implements OnInit {
  taskTitle = '';
  taskDescription = '';
  selectedCategoryId: string | null = null;
  selectedPriority: TaskPriority = 'medium';
  submitted = false;
  categories$!: Observable<Category[]>;

  /** Feature flags reactivos */
  categoriesEnabled$: Observable<boolean>;
  prioritiesEnabled$: Observable<boolean>;

  constructor(
    private modalCtrl: ModalController,
    private categoryService: CategoryService,
    private featureFlagService: FeatureFlagService
  ) {
    this.categoriesEnabled$ = this.featureFlagService.categoriesEnabled$;
    this.prioritiesEnabled$ = this.featureFlagService.prioritiesEnabled$;
  }

  async ngOnInit(): Promise<void> {
    await this.categoryService.loadCategories();
    this.categories$ = this.categoryService.categories$;
  }

  cancel(): void { this.modalCtrl.dismiss(null, 'cancel'); }

  save(): void {
    this.submitted = true;
    const title = this.taskTitle.trim();
    if (!title) return;
    this.modalCtrl.dismiss({ title, description: this.taskDescription.trim() || undefined, categoryId: this.selectedCategoryId, priority: this.selectedPriority }, 'save');
  }
}
