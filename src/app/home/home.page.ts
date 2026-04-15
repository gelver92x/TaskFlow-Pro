import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonBadge,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonText,
  ModalController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { TaskItemComponent } from '../components/task-item/task-item.component';
import { TaskFormModalComponent } from '../components/task-form-modal/task-form-modal.component';

/**
 * HomePage — Main view of the TaskFlow application.
 *
 * This page displays the list of all tasks and provides controls for:
 * - Adding new tasks via a floating action button (FAB).
 * - Toggling task completion via checkboxes.
 * - Deleting tasks via swipe-to-delete with confirmation.
 * - Pull-to-refresh to reload the task list.
 * - Empty state when no tasks exist.
 *
 * The page uses an async pipe to subscribe to the TaskService's
 * reactive task stream, ensuring automatic cleanup on destroy.
 *
 * @standalone — No NgModule required.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonFab,
    IonFabButton,
    IonIcon,
    IonBadge,
    IonButtons,
    IonRefresher,
    IonRefresherContent,
    IonText,
    TranslateModule,
    TaskItemComponent,
  ],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  /** Observable stream of all tasks, used with async pipe in template */
  tasks$: Observable<Task[]>;

  /** Current count of pending (incomplete) tasks */
  pendingCount = 0;

  constructor(
    private taskService: TaskService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    addIcons({ addOutline, checkmarkDoneOutline });
    this.tasks$ = this.taskService.tasks$;
  }

  /**
   * Lifecycle hook — loads tasks from storage on page initialization.
   * Also subscribes to the task stream to keep pendingCount updated.
   */
  async ngOnInit(): Promise<void> {
    await this.taskService.loadTasks();

    this.tasks$.subscribe(() => {
      this.pendingCount = this.taskService.getTaskCount().pending;
    });
  }

  /**
   * Opens the task creation modal.
   * If the user saves, the new task is added via TaskService.
   */
  async openAddTaskModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TaskFormModalComponent,
      breakpoints: [0, 0.35, 0.5],
      initialBreakpoint: 0.35,
      handleBehavior: 'cycle',
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'save' && data) {
      await this.taskService.addTask(data);
    }
  }

  /**
   * Handles the toggle-complete event from a TaskItemComponent.
   *
   * @param taskId - The ID of the task to toggle.
   */
  async onToggleComplete(taskId: string): Promise<void> {
    await this.taskService.toggleComplete(taskId);
  }

  /**
   * Handles the delete event from a TaskItemComponent.
   * Presents a confirmation alert before deletion.
   *
   * @param taskId - The ID of the task to delete.
   */
  async onDeleteTask(taskId: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete Task',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.taskService.deleteTask(taskId);
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Handles pull-to-refresh gesture.
   * Reloads tasks from storage and completes the refresher.
   *
   * @param event - The Ionic refresher custom event.
   */
  async onRefresh(event: CustomEvent): Promise<void> {
    await this.taskService.loadTasks();
    (event.target as HTMLIonRefresherElement).complete();
  }

  /**
   * TrackBy function for *ngFor optimization.
   * Returns the task ID as the tracking key.
   *
   * @param index - The array index.
   * @param task - The task object.
   * @returns The unique task ID.
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
