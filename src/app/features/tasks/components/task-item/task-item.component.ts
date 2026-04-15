import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import {
  IonItem, IonLabel, IonCheckbox, IonItemSliding,
  IonItemOptions, IonItemOption, IonIcon, IonNote, IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Task } from '../../../../models/task.model';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [NgClass, NgStyle, IonItem, IonLabel, IonCheckbox, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonNote, IonBadge],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() deleteTask = new EventEmitter<string>();

  constructor(private categoryService: CategoryService) { addIcons({ trashOutline }); }
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
  getRelativeTime(): string {
    const diffMs = new Date().getTime() - new Date(this.task.createdAt).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMin < 1) return 'Ahora';
    if (diffMin < 60) return `hace ${diffMin}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    return `hace ${diffDays}d`;
  }
}
