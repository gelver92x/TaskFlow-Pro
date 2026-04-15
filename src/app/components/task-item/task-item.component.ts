import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Task } from '../../models/task.model';

/**
 * TaskItemComponent — Displays a single task with interactive controls.
 *
 * Features:
 * - Checkbox to toggle task completion status.
 * - Visual strikethrough and reduced opacity when completed.
 * - Swipe-left action to reveal the delete button.
 * - Emits events for toggle and delete actions.
 *
 * This is a standalone, presentational component with no direct
 * service dependencies — it communicates purely through @Input/@Output.
 *
 * @example
 * ```html
 * <app-task-item
 *   [task]="task"
 *   (toggleComplete)="onToggle($event)"
 *   (delete)="onDelete($event)">
 * </app-task-item>
 * ```
 */
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    NgClass,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonNote,
  ],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  /** The task data to display */
  @Input({ required: true }) task!: Task;

  /** Emitted when the user toggles the checkbox. Payload is the task ID. */
  @Output() toggleComplete = new EventEmitter<string>();

  /** Emitted when the user taps the delete action. Payload is the task ID. */
  @Output() deleteTask = new EventEmitter<string>();

  constructor() {
    addIcons({ trashOutline });
  }

  /**
   * Handles checkbox change event.
   * Emits the task ID for the parent to process.
   */
  onToggle(): void {
    this.toggleComplete.emit(this.task.id);
  }

  /**
   * Handles delete action from the swipe menu.
   * Emits the task ID for the parent to process.
   */
  onDelete(): void {
    this.deleteTask.emit(this.task.id);
  }

  /**
   * Returns a human-readable relative time string for the task's creation date.
   *
   * @returns A string like "hace 2 horas" or "2 hours ago".
   */
  getRelativeTime(): string {
    const now = new Date().getTime();
    const created = new Date(this.task.createdAt).getTime();
    const diffMs = now - created;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}
