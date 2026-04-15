import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonInput,
  IonItem,
  IonList,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

/**
 * TaskFormModalComponent — Modal dialog for creating new tasks.
 *
 * Presents a simple form with:
 * - A text input for the task title (required, max 100 chars).
 * - Cancel and Save buttons in the toolbar.
 * - Inline validation feedback for empty titles.
 *
 * On save, the modal dismisses with the task title as the return data.
 * On cancel, the modal dismisses with no data.
 *
 * This component uses Ionic's ModalController for open/close orchestration.
 *
 * @example
 * ```typescript
 * // Opening the modal from a parent component
 * const modal = await this.modalCtrl.create({
 *   component: TaskFormModalComponent,
 * });
 * await modal.present();
 *
 * const { data } = await modal.onDidDismiss();
 * if (data) {
 *   await this.taskService.addTask(data);
 * }
 * ```
 */
@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonInput,
    IonItem,
    IonList,
    IonText,
    TranslateModule,
  ],
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.scss'],
})
export class TaskFormModalComponent {
  /** The task title entered by the user */
  taskTitle = '';

  /** Whether the form has been submitted (for validation display) */
  submitted = false;

  constructor(private modalCtrl: ModalController) {}

  /**
   * Dismisses the modal without returning any data.
   * Called when the user taps Cancel.
   */
  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  /**
   * Validates the form and dismisses the modal with the task title.
   * If the title is empty, sets submitted=true to show validation error.
   */
  save(): void {
    this.submitted = true;

    const title = this.taskTitle.trim();
    if (!title) {
      return;
    }

    this.modalCtrl.dismiss(title, 'save');
  }
}
