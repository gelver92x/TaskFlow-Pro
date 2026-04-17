import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { NgClass, NgStyle, AsyncPipe } from '@angular/common';
import {
  IonItem, IonLabel, IonCheckbox, IonItemSliding,
  IonItemOptions, IonItemOption, IonIcon, IonNote, IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, arrowBackOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { Task } from '../../../../models/task.model';
import { CategoryService } from '../../../../services/category.service';
import { FeatureFlagService } from '../../../../services/feature-flag.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [NgClass, NgStyle, AsyncPipe, IonItem, IonLabel, IonCheckbox, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonNote, IonBadge, TranslateModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent implements AfterViewInit {
  @Input({ required: true }) task!: Task;
  @Input() showSwipeHint = false;
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() deleteTask = new EventEmitter<string>();
  
  @ViewChild(IonItemSliding) slidingItem!: IonItemSliding;

  /** Feature flags reactivos */
  prioritiesEnabled$: Observable<boolean>;
  categoriesEnabled$: Observable<boolean>;

  constructor(
    private categoryService: CategoryService,
    private featureFlagService: FeatureFlagService
  ) {
    addIcons({ trashOutline, arrowBackOutline });
    this.prioritiesEnabled$ = this.featureFlagService.prioritiesEnabled$;
    this.categoriesEnabled$ = this.featureFlagService.categoriesEnabled$;
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.showSwipeHint && this.slidingItem) {
      setTimeout(async () => {
        await this.slidingItem.open('end');
        setTimeout(async () => {
          await this.slidingItem.close();
        }, 1500);
      }, 800);
    }
  }

  onToggle(): void { this.toggleComplete.emit(this.task.id); }
  onDelete(): void { this.deleteTask.emit(this.task.id); }

  getCategoryName(): string | null {
    if (!this.task.categoryId) return null;
    const cat = this.categoryService.getCategoryById(this.task.categoryId);
    return cat ? cat.name : null;
  }
  getCategoryColor(): string {
    if (!this.task.categoryId) return 'var(--ion-color-medium)';
    const cat = this.categoryService.getCategoryById(this.task.categoryId);
    return cat ? cat.color : 'var(--ion-color-medium)';
  }
  getPriorityColor(): string {
    const colors: Record<string, string> = { low: '#22C55E', medium: '#F59E0B', high: '#EF4444' };
    return colors[this.task.priority] || colors['medium'];
  }
  getRelativeTime(): { key: string; params?: any } {
    const diffMs = new Date().getTime() - new Date(this.task.createdAt).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMin < 1) return { key: 'tasks.timeNow' };
    if (diffMin < 60) return { key: 'tasks.timeMinutes', params: { n: diffMin } };
    if (diffHours < 24) return { key: 'tasks.timeHours', params: { n: diffHours } };
    return { key: 'tasks.timeDays', params: { n: diffDays } };
  }
}
